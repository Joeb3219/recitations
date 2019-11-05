export async function isAuthenticated(req, res, next) {
	if(res.locals.currentUser) next()	
}