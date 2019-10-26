if(process.env.NODE_ENV === 'production') {
	module.exports = {
		mongoURI: 'mongodb://abhijeet:abhijeet31@ds023634.mlab.com:23634/heroku_w8794dl5'
	}
} else {
	module.exports = {
		mongoURI: 'mongodb://localhost/vidjot-dev'	
	}
}