import db from '../db/db'
import joi from 'joi'
import rand from 'randexp'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import fse from 'fs-extra'
import sgMail from '@sendgrid/mail'
import dateFormat from 'date-fns/format'
import dateAddMinutes from 'date-fns/add_minutes'
import dateAddMonths from 'date-fns/add_months'
import dateCompareAsc from 'date-fns/compare_asc'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const userSchemaSignup = joi.object({
    firstName: joi
        .string()
        .min(1)
        .max(25)
        .alphanum()
        .required(),
    lastName: joi
        .string()
        .min(1)
        .max(25)
        .alphanum()
        .required(),
    username: joi
        .string()
        .min(3)
        .max(100)
        .regex(/[a-zA-Z0-9@]/)
        .required(),
    email: joi
        .string()
        .email()
        .required(),
    password: joi
        .string()
        .min(8)
        .max(35)
        .required(),
})

const userSchemaResetPassword = joi.object({
    email: joi
        .string()
        .email()
        .required(),
    password: joi
        .string()
        .min(8)
        .max(35)
        .required(),
    passwordResetToken: joi
        .string()
        .required(),
})

class UserController {
    constructor() {}

    async signup(ctx) {
        //First let's save off the ctx.request.body. Throughout this project
        //we're going to try and avoid using the ctx.request.body and instead use
        //our own object that is seeded by the ctx.request.body initially
        const request = ctx.request.body

        //Next do validation on the input
        const validator = joi.validate(request, userSchemaSignup)
        if (validator.error) {
            ctx.throw(400, validator.error.details[0].message)
        }

        //Now let's check for a duplicate username
        var [result] = await db('users')
            .where({
                username: request.username,
            })
            .count('id as id')
        if (result.id) {
            ctx.throw(400, 'DUPLICATE_USERNAME')
        }

        //..and duplicate email
        var [result] = await db('users')
            .where({
                email: request.email,
            })
            .count('id as id')
        if (result.id) {
            ctx.throw(400, 'DUPLICATE_EMAIL')
        }

        //Now let's generate a token for this user
        request.token = await this.generateUniqueToken()

        //Ok now let's hash their password.
        try {
            request.password = await bcrypt.hash(request.password, 12)
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }

        //Let's grab their ipaddress
        //TODO: This doesn't work correctly because of the reverse-proxy
        request.ipAddress = ctx.request.ip

        //Ok, at this point we can sign them up.
        try {
            var [result] = await db('users')
                .insert(request)
                .returning('id')

            //Let's send a welcome email.
            if (process.env.NODE_ENV !== 'testing') {
                //Let's turn off welcome emails for the moment

                // let email = await fse.readFile(
                //     './src/email/welcome.html',
                //     'utf8'
                // )
                // const emailData = {
                //     to: request.email,
                //     from: process.env.APP_EMAIL,
                //     subject: 'Welcome To Koa-Vue-Notes-Api',
                //     html: email,
                //     categories: ['koa-vue-notes-api-new-user'],
                //     substitutions: {
                //         appName: process.env.APP_NAME,
                //         appEmail: process.env.APP_EMAIL,
                //     },
                // }
                // await sgMail.send(emailData)
            }

            //And return our response.
            ctx.body = { message: 'SUCCESS', id: result }
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async authenticate(ctx) {
        const request = ctx.request.body

        if (!request.username || !request.password) {
            ctx.throw(404, 'INVALID_DATA')
        }

        //Let's find that user
        var [userData] = await db('users')
            .where({
                username: request.username,
            })
            .select('id', 'token', 'username', 'email', 'password', 'isAdmin')
        if (!userData) {
            ctx.throw(401, 'INVALID_CREDENTIALS')
        }

        //Now let's check the password
        try {
            let correct = await bcrypt.compare(
                request.password,
                userData.password
            )
            if (!correct) {
                ctx.throw(400, 'INVALID_CREDENTIALS')
            }
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }

        //Let's get rid of that password now for security reasons
        delete userData.password

        //Generate the refreshToken data
        let refreshTokenData = {
            username: userData.username,
            refreshToken: new rand(/[a-zA-Z0-9_-]{64,64}/).gen(),
            info:
                ctx.userAgent.os +
                ' ' +
                ctx.userAgent.platform +
                ' ' +
                ctx.userAgent.browser,
            ipAddress: ctx.request.ip,
            expiration: dateAddMonths(new Date(), 1),
            isValid: true
        }

        //Insert the refresh data into the db
        try {
            await db('refresh_tokens').insert(refreshTokenData)
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }

        //Update their login count
        try {
            await db('users')
                .increment('loginCount')
                .where({ id: userData.id })
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }

        //Ok, they've made it, send them their jsonwebtoken with their data, accessToken and refreshToken
        const token = jsonwebtoken.sign(
            { data: userData },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }
        )
        ctx.body = {
            accessToken: token,
            refreshToken: refreshTokenData.refreshToken,
        }
    }

    async refreshAccessToken(ctx) {
        const request = ctx.request.body
        if (!request.username || !request.refreshToken) {
            ctx.throw(401, 'NO_REFRESH_TOKEN')
        }

        //Let's find that user and refreshToken in the refreshToken table
        const [refreshTokenDatabaseData] = await db('refresh_tokens')
            .select('username', 'refreshToken', 'expiration')
            .where({
                username: request.username,
                refreshToken: request.refreshToken,
                isValid: true,
            })
        if (!refreshTokenDatabaseData) {
            ctx.throw(400, 'INVALID_REFRESH_TOKEN')
        }

        //Let's make sure the refreshToken is not expired
        const refreshTokenIsValid = dateCompareAsc(
            dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            refreshTokenDatabaseData.expiration
        )
        if (refreshTokenIsValid !== -1) {
            ctx.throw(400, 'REFRESH_TOKEN_EXPIRED')
        }

        //Ok, everthing checked out. So let's invalidate the refresh token they just confirmed, and get them hooked up with a new one.
        try {
            await db('refresh_tokens')
                .update({
                    isValid: false,
                    updatedAt: dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                })
                .where({ refreshToken: refreshTokenDatabaseData.refreshToken })
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA1')
        }

        const [userData] = await db('users')
            .select('id', 'token', 'username', 'email', 'isAdmin')
            .where({ username: request.username })
        if (!userData) {
            ctx.throw(401, 'INVALID_REFRESH_TOKEN')
        }

        //Generate the refreshToken data
        let refreshTokenData = {
            username: request.username,
            refreshToken: new rand(/[a-zA-Z0-9_-]{64,64}/).gen(),
            info:
                ctx.userAgent.os +
                ' ' +
                ctx.userAgent.platform +
                ' ' +
                ctx.userAgent.browser,
            ipAddress: ctx.request.ip,
            expiration: dateAddMonths(new Date(), 1),
            isValid: true
        }

        //Insert the refresh data into the db
        try {
            await db('refresh_tokens').insert(refreshTokenData)
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }

        //Ok, they've made it, send them their jsonwebtoken with their data, accessToken and refreshToken
        const token = jsonwebtoken.sign(
            { data: userData },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }
        )
        ctx.body = {
            accessToken: token,
            refreshToken: refreshTokenData.refreshToken,
        }
    }

    async invalidateAllRefreshTokens(ctx) {
        const request = ctx.request.body
        try {
            await db('refresh_tokens')
                .update({
                    isValid: false,
                    updatedAt: dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                })
                .where({ username: request.username })
            ctx.body = { message: 'SUCCESS' }
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async invalidateRefreshToken(ctx) {
        const request = ctx.request.body
        if (!request.refreshToken) {
            ctx.throw(404, 'INVALID_DATA')
        }
        try {
            await db('refresh_tokens')
                .update({
                    isValid: false,
                    updatedAt: dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                })
                .where({
                    username: ctx.state.user.username,
                    refreshToken: request.refreshToken,
                })
            ctx.body = { message: 'SUCCESS' }
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }
    }

    async forgot(ctx) {
        const request = ctx.request.body

        if (!request.email || !request.url || !request.type) {
            ctx.throw(404, 'INVALID_DATA')
        }

        let resetData = {
            passwordResetToken: new rand(/[a-zA-Z0-9_-]{64,64}/).gen(),
            passwordResetExpiration: dateAddMinutes(new Date(), 30),
        }

        try {
            var result = await db('users')
                .update(resetData)
                .where({ email: request.email })
                .returning('id')
            if (!result) {
                ctx.throw(400, 'INVALID_DATA')
            }
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }

        //Now for the email if they've chosen the web type of forgot password
        if (request.type === 'web') {
            let email = await fse.readFile('./src/email/forgot.html', 'utf8')
            let resetUrlCustom =
                request.url +
                '?passwordResetToken=' +
                resetData.passwordResetToken +
                '&email=' +
                request.email

            const emailData = {
                to: request.email,
                from: process.env.APP_EMAIL,
                subject: 'Password Reset For ' + process.env.APP_NAME,
                html: email,
                categories: ['koa-vue-notes-api-forgot'],
                substitutions: {
                    appName: process.env.APP_NAME,
                    email: request.email,
                    resetUrl: resetUrlCustom,
                },
            }

            // Let's only send the email if we're not testing
            if (process.env.NODE_ENV !== 'testing') {
                await sgMail.send(emailData)
            }
        }

        ctx.body = { passwordResetToken: resetData.passwordResetToken }
    }

    async checkPasswordResetToken(ctx) {
        const request = ctx.request.body

        if (!request.passwordResetToken || !request.email) {
            ctx.throw(404, 'INVALID_DATA')
        }

        let [passwordResetData] = await db('users')
            .select('passwordResetExpiration')
            .where({
                email: request.email,
                passwordResetToken: request.passwordResetToken,
            })
        if (!passwordResetData.passwordResetExpiration) {
            ctx.throw(404, 'INVALID_TOKEN')
        }

        //Let's make sure the refreshToken is not expired
        var tokenIsValid = dateCompareAsc(
            dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            passwordResetData.passwordResetExpiration
        )
        if (tokenIsValid !== -1) {
            ctx.throw(400, 'RESET_TOKEN_EXPIRED')
        }

        ctx.body = { message: 'SUCCESS' }
    }

    async resetPassword(ctx) {
        const request = ctx.request.body

        //First do validation on the input
        const validator = joi.validate(request, userSchemaResetPassword)
        if (validator.error) {
            ctx.throw(400, validator.error.details[0].message)
        }

        //Ok, let's make sure their token is correct again, just to be sure since it could have
        //been some time between page entrance and form submission
        let [passwordResetData] = await db('users')
            .select('passwordResetExpiration')
            .where({
                email: request.email,
                passwordResetToken: request.passwordResetToken,
            })
        if (!passwordResetData.passwordResetExpiration) {
            ctx.throw(404, 'INVALID_TOKEN')
        }

        var tokenIsValid = dateCompareAsc(
            dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            passwordResetData.passwordResetExpiration
        )
        if (tokenIsValid !== -1) {
            ctx.throw(400, 'RESET_TOKEN_EXPIRED')
        }

        //Ok, so we're good. Let's reset their password with the new one they submitted.

        //Hash it
        try {
            request.password = await bcrypt.hash(request.password, 12)
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }

        //Make sure to null out the password reset token and expiration on insertion
        request.passwordResetToken = null
        request.passwordResetExpiration = null
        try {
            await db('users')
                .update({
                    password: request.password,
                    passwordResetToken: request.passwordResetToken,
                    passwordResetExpiration: request.passwordResetExpiration,
                })
                .where({ email: request.email })
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA')
        }
        ctx.body = { message: 'SUCCESS' }
    }

    async private(ctx) {
        ctx.body = { user: ctx.state.user }
    }

    //Helpers
    async generateUniqueToken() {
        let token = new rand(/[a-zA-Z0-9_-]{7,7}/).gen()

        if (await this.checkUniqueToken(token)) {
            await this.generateUniqueToken()
        } else {
            return token
        }
    }

    async checkUniqueToken(token) {
        let result = await db('users')
            .where({
                token: token,
            })
            .count('id as id')
        if (result[0].id) {
            return true
        }
        return false
    }
}

export default UserController
