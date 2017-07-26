// //Holding as scratch
// async private(ctx) {
//     ctx.body = {'message': ctx.state.user}
// }

// async getAllUsers(ctx) {
//     try {
//         let result = await pool.query(`SELECT * FROM koa_vue_notes_users`)
//         ctx.body = result
//     } catch (error) {
//         ctx.throw(400, error)
//     }
// }

// async getUser(ctx) {
//     if (!ctx.request.query.id) { ctx.throw(400, error) }
//     // try {
//     //     let result = await pool.query(`SELECT * FROM koa_vue_notes_users`)
//     //     ctx.body = result
//     // } catch (error) {
//     //     console.log(error)
//     //     ctx.throw(400, error)
//     // }
// }