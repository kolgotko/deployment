var express = require('express');
var router = express.Router();
var fs = require('fs');
var execSync = require('child_process').execSync;
var repo = require('Repo');


router.post('/',function(req,res,next){
	if(req.body.repoName){
			var stat = fs.existsSync(repo.repoPath+req.body.repoName) ? fs.statSync(repo.repoPath+req.body.repoName) : null;
			stat && stat.isDirectory() ? repo.pull(req.body.repoName) : repo.clone(req.body.repoName);
	}
	next();
});

router.post('/',function(req,resp,next){
	if(req.body.delete && req.body.selected){
		for(i=0;i!=req.body.selected.length;i++)
		execSync('rm -dfR '+repo.repoPath+req.body.selected[i]);
	}
	next();
});

router.post('/',function(req,resp,next){
	req.body.pull && repo.pull(req.body.pull);
	next();
});

router.use('/',function(req,res,next){
	res.render('index',{repoList:repo.getLocalRepos(),log:repo.getLog()});
});

module.exports = router;
