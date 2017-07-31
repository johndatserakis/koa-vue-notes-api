import {} from 'dotenv/config';
import pool from '../db';
import joi from 'joi';
import rand from 'randexp';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import fse from 'fs-extra';
import sgMail from '@sendgrid/mail';
import dateFormat from 'date-fns/format';
import dateAddMinutes from 'date-fns/add_minutes';
import dateAddMonths from 'date-fns/add_months';
import dateCompareAsc from 'date-fns/compare_asc';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userSchemaSignup = joi.object({
    firstName: joi.string().min(1).max(25).alphanum().required(),
    lastName: joi.string().min(1).max(25).alphanum().required(),
    username: joi.string().min(3).max(100).regex(/[a-zA-Z0-9@]/).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(35).required(),
});

const userSchemaResetPassword = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(35).required(),
    passwordResetToken: joi.string().required(),
});

class UserController {
    constructor() {}

    async signup(ctx) {
        //First do validation on the input
        const validator = joi.validate(ctx.request.body, userSchemaSignup);
        if (validator.error) {
            ctx.throw(400, validator.error.details[0].message);
        }

        //Now let's check for a duplicate username
        var count = await pool.query(
            `SELECT COUNT(id) as count FROM koa_vue_notes_users WHERE username = ?`,
            ctx.request.body.username
        );
        if (count[0].count) {
            ctx.throw(400, 'DUPLICATE_USERNAME');
        }

        //And now for a duplicate email
        var count = await pool.query(
            `SELECT COUNT(id) as count FROM koa_vue_notes_users WHERE email = ?`,
            ctx.request.body.email
        );
        if (count[0].count) {
            ctx.throw(401, 'DUPLICATE_EMAIL');
        }

        //Now let's generate a token for this user
        ctx.request.body.token = await this.generateUniqueToken();

        //Ok now let's hash their password.
        try {
            ctx.request.body.password = await bcrypt.hash(
                ctx.request.body.password,
                12
            );
        } catch (error) {
            ctx.throw(400, error);
        }

        //Let's grab their ipaddress
        ctx.request.body.ipAddress = ctx.request.ip;

        //Ok, at this point we can sign them up.
        try {
            let result = await pool.query(
                `INSERT INTO koa_vue_notes_users SET ?`,
                ctx.request.body
            );

            //Let's send a welcome email.
            let email = await fse.readFile('./src/email/welcome.html', 'utf8');
            const emailData = {
                to: ctx.request.body.email,
                from: process.env.APP_EMAIL,
                subject: 'Welcome To Koa-Vue-Notes-Api',
                html: email,
                categories: ['koa-vue-notes-api-new-user'],
                substitutions: {
                    appName: process.env.APP_NAME,
                    appEmail: process.env.APP_EMAIL,
                },
            };
            await sgMail.send(emailData);

            //And return our response.
            ctx.body = { message: 'SUCCESS' };
        } catch (error) {
            ctx.throw(400, error);
        }
    }

    async authenticate(ctx) {
        if (!ctx.request.body.username || !ctx.request.body.password) {
            ctx.throw(404, 'INVALID_DATA');
        }

        //Let's find that user
        let userData = await pool.query(
            `SELECT id, token, username, email, password, isAdmin FROM koa_vue_notes_users WHERE username = ?`,
            ctx.request.body.username
        );
        if (!userData.length) {
            ctx.throw(401, 'INVALID_CREDENTIALS');
        }

        //Now let's check the password
        try {
            let correct = await bcrypt.compare(
                ctx.request.body.password,
                userData[0].password
            );
            if (!correct) {
                ctx.throw(400, 'INVALID_CREDENTIALS');
            }
        } catch (error) {
            ctx.throw(400, error);
        }

        //Let's get rid of that password now for security reasons
        delete userData[0].password;

        //Generate the refreshToken data
        let refreshTokenData = {
            username: userData[0].username,
            refreshToken: new rand(/[a-zA-Z0-9_-]{64,64}/).gen(),
            info:
                ctx.userAgent.os +
                ' ' +
                ctx.userAgent.platform +
                ' ' +
                ctx.userAgent.browser,
            ipAddress: ctx.request.ip,
            expiration: dateAddMonths(new Date(), 1),
        };

        //Insert the refresh data into the db
        try {
            await pool.query(
                `INSERT INTO koa_vue_notes_refresh_tokens SET ?`,
                refreshTokenData
            );
        } catch (error) {
            ctx.throw(400, error);
        }

        //Ok, they've made it, send them their jsonwebtoken with their data, accessToken and refreshToken
        const token = jsonwebtoken.sign(
            { data: userData },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }
        );
        ctx.body = {
            access_token: token,
            refreshToken: refreshTokenData.refreshToken,
        };
    }

    async refreshAccessToken(ctx) {
        if (!ctx.request.body.username || !ctx.request.body.refreshToken)
            ctx.throw(401, 'NO_REFRESH_TOKEN');

        //Let's find that user and refreshToken in the refreshToken table
        var refreshTokenDatabaseData = await pool.query(
            `SELECT username, refreshToken, expiration FROM koa_vue_notes_refresh_tokens WHERE (username = ? AND refreshToken = ? AND isValid = 1)`,
            [ctx.request.body.username, ctx.request.body.refreshToken]
        );
        if (!refreshTokenDatabaseData.length) {
            ctx.throw(400, 'INVALID_REFRESH_TOKEN');
        }

        //Let's make sure the refreshToken is not expired
        var refreshTokenIsValid = dateCompareAsc(
            dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            refreshTokenDatabaseData[0].expiration
        );
        if (refreshTokenIsValid !== -1) {
            ctx.throw(400, 'REFRESH_TOKEN_EXPIRED');
        }

        //Ok, everthing checked out. So let's invalidate the refresh token they just confirmed, and get them
        //hooked up with a new one.
        try {
            await pool.query(
                `UPDATE koa_vue_notes_refresh_tokens SET isValid = 0, updatedAt = ? WHERE refreshToken = ?`,
                [
                    dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    refreshTokenDatabaseData[0].refreshToken,
                ]
            );
        } catch (error) {
            ctx.throw(400, error);
        }

        //Let's find that user
        let userData = await pool.query(
            `SELECT id, token, username, email, isAdmin FROM koa_vue_notes_users WHERE username = ?`,
            refreshTokenDatabaseData[0].username
        );
        if (!userData.length) {
            ctx.throw(401, 'INVALID_REFRESH_TOKEN');
        }

        //Let's gather the new refreshToken data
        //Generate the refreshToken data
        let refreshTokenData = {
            username: refreshTokenDatabaseData[0].username,
            refreshToken: new rand(/[a-zA-Z0-9_-]{64,64}/).gen(),
            info:
                ctx.userAgent.os +
                ' ' +
                ctx.userAgent.platform +
                ' ' +
                ctx.userAgent.browser,
            ipAddress: ctx.request.ip,
            expiration: dateAddMonths(new Date(), 1),
        };

        //Insert the refresh data into the db
        try {
            await pool.query(
                `INSERT INTO koa_vue_notes_refresh_tokens SET ?`,
                refreshTokenData
            );
        } catch (error) {
            ctx.throw(400, error);
        }

        //Ok, they've made it, send them their jsonwebtoken with their data, accessToken and refreshToken
        const token = jsonwebtoken.sign(
            { data: userData },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }
        );
        ctx.body = {
            access_token: token,
            refreshToken: refreshTokenData.refreshToken,
        };
    }

    async invalidateAllRefreshTokens(ctx) {
        try {
            await pool.query(
                `UPDATE koa_vue_notes_refresh_tokens SET isValid = 0, updatedAt = ? WHERE username = ?`,
                [
                    dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    ctx.state.user[0].username,
                ]
            );
        } catch (error) {
            ctx.throw(400, error);
        }

        ctx.body = { message: 'SUCCESS' };
    }

    async invalidateRefreshToken(ctx) {
        if (!ctx.request.body.refreshToken) {
            ctx.throw(404, 'INVALID_DATA');
        }

        try {
            await pool.query(
                `UPDATE koa_vue_notes_refresh_tokens SET isValid = 0, updatedAt = ? WHERE username = ? AND refreshToken = ?`,
                [
                    dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
                    ctx.state.user[0].username,
                    ctx.request.body.refreshToken,
                ]
            );
        } catch (error) {
            ctx.throw(400, error);
        }

        ctx.body = { message: 'SUCCESS' };
    }

    async forgot(ctx) {
        if (
            !ctx.request.body.email ||
            !ctx.request.body.url ||
            !ctx.request.body.type
        ) {
            ctx.throw(404, 'INVALID_DATA');
        }

        let resetData = {
            passwordResetToken: new rand(/[a-zA-Z0-9_-]{64,64}/).gen(),
            passwordResetExpiration: dateAddMinutes(new Date(), 30),
        };

        try {
            let resultData = await pool.query(
                `UPDATE koa_vue_notes_users SET ? WHERE email = ?`,
                [resetData, ctx.request.body.email]
            );
            if (resultData.changedRows === 0) {
                ctx.throw(400, 'INVALID_DATA');
            }
        } catch (error) {
            ctx.throw(400, error);
        }

        //Now for the email.
        let email = await fse.readFile('./src/email/forgot.html', 'utf8');
        let resetUrlCustom;
        if (ctx.request.body.type === 'web') {
            resetUrlCustom =
                ctx.request.body.url +
                '?passwordResetToken=' +
                resetData.passwordResetToken +
                '&email=' +
                ctx.request.body.email;
        }
        const emailData = {
            to: ctx.request.body.email,
            from: process.env.APP_EMAIL,
            subject: 'Password Reset For ' + process.env.APP_NAME,
            html: email,
            categories: ['koa-vue-notes-api-forgot'],
            substitutions: {
                appName: process.env.APP_NAME,
                email: ctx.request.body.email,
                resetUrl: resetUrlCustom,
            },
        };
        await sgMail.send(emailData);

        ctx.body = { passwordResetToken: resetData.passwordResetToken };
    }

    async checkPasswordResetToken(ctx) {
        if (!ctx.request.body.passwordResetToken || !ctx.request.body.email) {
            ctx.throw(404, 'INVALID_DATA');
        }

        var passwordResetData = await pool.query(
            `SELECT passwordResetExpiration FROM koa_vue_notes_users WHERE (email = ? AND passwordResetToken = ?)`,
            [ctx.request.body.email, ctx.request.body.passwordResetToken]
        );
        if (!passwordResetData.length) {
            ctx.throw(400, 'INVALID_TOKEN');
        }

        //Let's make sure the refreshToken is not expired
        var tokenIsValid = dateCompareAsc(
            dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            passwordResetData[0].passwordResetExpiration
        );
        if (tokenIsValid !== -1) {
            ctx.throw(400, 'RESET_TOKEN_EXPIRED');
        }

        ctx.body = { message: 'SUCCESS' };
    }

    async resetPassword(ctx) {
        //First do validation on the input
        const validator = joi.validate(
            ctx.request.body,
            userSchemaResetPassword
        );
        if (validator.error) {
            ctx.throw(400, validator.error.details[0].message);
        }

        //Ok, let's make sure their token is correct again, just to be sure since it could have
        //been some time between page entrance and form submission
        var passwordResetData = await pool.query(
            `SELECT passwordResetExpiration FROM koa_vue_notes_users WHERE (email = ? AND passwordResetToken = ?)`,
            [ctx.request.body.email, ctx.request.body.passwordResetToken]
        );
        if (!passwordResetData.length) {
            ctx.throw(400, 'INVALID_TOKEN');
        }
        var tokenIsValid = dateCompareAsc(
            dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            passwordResetData[0].passwordResetExpiration
        );
        if (tokenIsValid !== -1) {
            ctx.throw(400, 'RESET_TOKEN_EXPIRED');
        }

        //Ok, so we're good. Let's reset their password with the new one they submitted.

        //Hash it
        try {
            ctx.request.body.password = await bcrypt.hash(
                ctx.request.body.password,
                12
            );
        } catch (error) {
            ctx.throw(400, error);
        }

        //Make sure to null out the password reset token and expiration on insertion
        ctx.request.body.passwordResetToken = null;
        ctx.request.body.passwordResetExpiration = null;
        try {
            let result = await pool.query(
                `UPDATE koa_vue_notes_users SET ?`,
                ctx.request.body
            );
        } catch (error) {
            ctx.throw(400, 'INVALID_DATA');
        }

        ctx.body = { message: 'SUCCESS' };
    }

    async private(ctx) {
        ctx.body = { user: ctx.state.user };
    }

    //Helpers
    async generateUniqueToken() {
        let token = new rand(/[a-zA-Z0-9_-]{7,7}/).gen();

        if (await this.checkUniqueToken(token)) {
            await this.generateUniqueToken();
        } else {
            return token;
        }
    }

    async checkUniqueToken(token) {
        let result = await pool.query(
            `SELECT COUNT(id) as count FROM koa_vue_notes_users WHERE token = ?`,
            token
        );
        if (result[0].count) {
            return true;
        }
    }

    getJwtToken(ctx) {
        if (!ctx.header || !ctx.header.authorization) {
            return;
        }

        const parts = ctx.header.authorization.split(' ');

        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                return credentials;
            }
        }
        return ctx.throw(401, 'AUTHENTICATION_ERROR');
    }
}

export default UserController;
