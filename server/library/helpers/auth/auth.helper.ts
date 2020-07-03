export async function isAuthenticated(req, res, next) {
	if(res.locals.currentUser) next()
	else throw new Error('Invalid login session')
}