var fs = require('fs');
var os=require('os');
var child_process=require('child_process');
execSync=child_process.execSync;

var Cron=new function(){
	this.get=function(){
		try{var stdout=execSync('crontab -l');}
		catch(e){
			addNew('');
			var stdout=execSync('crontab -l');
		}
		stdout=stdout.toString();
		var result=stdout.split('\n');
		object={};
		for(var i=0; i<result.length; i++) {
			var element=result[i].split('\t');
			if(Array.isArray(element) && element.length>4){
				object[i]={};
				object[i]['minutes']=element[0];
				object[i]['hours']=element[1];
				object[i]['day']=element[2];
				object[i]['mounth']=element[3];
				object[i]['dayli']=element[4];
				object[i]['command']=element[5];
			}
		}
		return object;
	}
	this.add=function (minutes,hours,day,mounth,dayli,command){
		var stdout=execSync('crontab -l');
		stdout=stdout.toString();
	  	stdout=(stdout ? stdout : '')+minutes+'\t'+hours+'\t'+day+'\t'+mounth+'\t'+dayli+'\t'+command+'\n';
	  	addNew(stdout);
	}
	this.del=function (nom){
		var stdout=execSync('crontab -l');
		stdout=stdout.toString();
		var result=stdout.split('\n');
		result.splice(nom,1);
		result=result.join('\n');
		addNew(result);
	}
	function addNew(stdout){
	  	var temp=os.tmpdir();
	  	var file=exports();
	  	fs.writeFileSync(temp+'/'+file+'.txt', stdout);
	  	execSync('crontab '+temp+'/'+file+'.txt');
		fs.unlinkSync(temp+'/'+file+'.txt');
	}
	function exports(){
		var time = new Date().getTime();
		while (time == new Date().getTime());
		return new Date().getTime().toString(36);
	}
}
module.exports=Cron;
