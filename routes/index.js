var express = require('express');
var router = express.Router();
var fs = require('fs');
var cron= require('../Cron.js');
var execSync = require('child_process').execSync;
var repo = require('Repo');
var active='repoContent';


router.post('/',function(req,res,next){
	if(req.body.repoName){
		var stat = fs.existsSync(repo.repoPath+req.body.repoName) ? fs.statSync(repo.repoPath+req.body.repoName) : null;
		stat && stat.isDirectory() ? repo.pull(req.body.repoName) : repo.clone(req.body.repoName);
		active='repoContent';
	}
	next();
});

router.post('/',function(req,resp,next){
	if(req.body.delete && req.body.selected){
		for(i=0;i!=req.body.selected.length;i++)
		execSync('rm -dfR '+repo.repoPath+req.body.selected[i]);
		active='repoContent';
	}
	next();
});

router.post('/',function(req,resp,next){
	req.body.pull && repo.pull(req.body.pull);
	active='repoContent';
	next();
});

router.post('/',function(req,resp,next){
	if(req.body.runAdd){
		var minutes=req.body.runMinutes ? req.body.runMinutes : '*';
		var hours=req.body.runHours ? req.body.runHours : '*';
		var days=req.body.runDays ? req.body.runDays : '*';
		var mounths=req.body.runMounths ? req.body.runMounths : '*';
		var dayli=req.body.runDayli ? req.body.runDayli : '*';
		if(req.body.runCommand){
			cron.add(minutes, hours, days, mounths, dayli, req.body.runCommand);
		}
		active='runContent';
	}
	next();
});

router.post('/',function(req,resp,next){
	if(req.body.delete_cron && req.body.selected_crons){
		for(i=0;i!=req.body.selected_crons.length;i++)
		cron.del(req.body.selected_crons[i]);
		active='runContent';
	}
	next();
});

router.use('/',function(req,res,next){
	console.log(active);
	res.render('index',{repoList:repo.getLocalRepos(),log:repo.getLog(),cronList:cron.get(),active:active});
});

module.exports = router;
