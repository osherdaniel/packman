var loginUserName;

var leftKey;
var rightKey;
var downKey;
var upKey;
var amountBalls;
var color5pt;
var color15pt;
var color25pt;
var gameTime;
var amountMonsters;

$(document).ready(function() {
	localStorage.setItem('k', 'k');
	
	// Validate Registration
	$("#form_registration").validate({
	  rules: {
		r_userName_n: {
			required: true,
			validUserName: true		
		},
		r_password_n: {
			required: true,
			minlength: 6,
			validPassword: true
		},
		name_n: {
			required: true,
			lettersWithSpace: true
		},
		email_n: {
			required: true,
			email: true
		},
		birthday_n: {
			required: true,
		}
	  },
	  messages: {
		r_userName_n: {
			required: "Please enter UserName",
			validUserName: "The UserName is already exist"
		},
		r_password_n: {
			required: "Please enter Password",
			minlength: "The password must contains 6 chars",
			validPassword: "Please enter valid Password"
		},
		name_n: {
			required: "Please enter Name",
			lettersWithSpace: "Please enter valid Name"
		},
		email_n: {
			required: "Please enter E-Mail",
			email: "Please enter valid E-Mail"
		},
		birthday_n: {
			required: "Please enter Birthday"
		},},
		
	  	submitHandler: function() {
			Registration ()
			$("#form_registration")[0].reset();
	  	}
	});

	// Validate Login
    var submitted = false;
	$("#form_login").validate({
        
		rules: {
			l_userName_n: {
			  required: true,
		  	},
			l_password_n: {
				required: true,
				validUserNameAndPass: true	
			}
		},
		messages: {
			l_userName_n: {
				required: "Please enter UserName",
			},
			l_password_n: {
				required: "Please enter Password",
				validUserNameAndPass: "The username or password is wrong"
			},	
		},
        showErrors: function(errorMap, errorList) {
            if (submitted) {
                var summary = "You have the following errors: \n";
                $.each(errorList, function() { summary += " * " + this.message + "\n"; });
                alert(summary);
                submitted = false;
            }
            this.defaultShowErrors();
        },          
        invalidHandler: function(form, validator) {
            submitted = true;
        },
		submitHandler: function() {
			Login();
			$("#form_login")[0].reset();
		}
	});
	
	// Validate Settings
	$("#form_settings").validate({
		rules: {
			upArrow_n: {
			  notEqualTo: '#downArrow',
		  	},
			leftArrow_n: {
				notEqualTo: '#upArrow',
				notEqualTo: '#downArrow'
			},
			rightArrow_n: {
				notEqualTo: '#upArrow',
				notEqualTo: '#downArrow',
				notEqualTo: '#leftArrow'
			},
			number_n: {
				required: true,
				number: true,
				min: 60 
			},
		},
		messages: {
			downArrow_n: {
				notEqualTo: 'The key already taken!'
			},
			upArrow_n: {
				notEqualTo: 'The key already taken!'
			},
			leftArrow_n: {
				notEqualTo: 'The key already taken!'
			},
			rightArrow_n: {
				notEqualTo: 'The key already taken!'
			}, 
			number_n: {
				required: 'Please enter the Game Time',
				number: 'Please enter only numbers',
				min: 'Min duration is 60sec'
			},	
		},
		submitHandler: function() {
			menu("gameMode");
			SaveSettings();

			context = canvas.getContext("2d");
			Start();
		}
	});
});


$(function() {

	//Registration - Password
	$.validator.addMethod('validPassword', function (value, element) {
		return this.optional(element) || /[a-z]/i.test(value) && /\d/.test(value);	
	});
	//Registration - UserName
	$.validator.addMethod('validUserName', function (value, element) {
		let password = localStorage.getItem(value);
		if (password == null) {
			return true;
		}
		else {
			return false
		}
	});

	$.validator.addMethod("lettersWithSpace", function(value, element) {
		return this.optional(element) || /^[a-z][a-z\s]*$/i.test(value);
	}, "letters only")

	// Login
	$.validator.addMethod('validUserNameAndPass', function (value, element) {
		let userName = document.getElementById("l_username_ID").value;
		let password = localStorage.getItem(userName);

		if (password == null) 
			return false;
		else if (password != value) 
				return false;
		return true;
	});
});

function hide() {
	$('#welcome').hide();
	$('#register').hide();
	$('#login').hide();
	$('#settings').hide();
	$('#gameMode').hide();
    
    var modal = document.getElementById("myModal");
	modal.style.display = "none";
};

// Menu
function menu(nav) {
    hide();
	if(nav != "about")
	{
		if (nav != "gameMode"){
			var audio = document.getElementById("myAudio");
			audio.pause();
	
			ClearAllIntervals();
		}
		
		$('#' + nav).show();
	}
	else 
		aboutMode();
	
};

// About
function aboutMode()
{
	var audio = document.getElementById("myAudio");
	audio.src = "./resources/audio/Background-Audio.mp3";
	audio.pause();

	ClearAllIntervals();

	var modal = document.getElementById("myModal");
	modal.style.display = "block";
	
	var span = document.getElementsByClassName("close")[0];
	span.onclick = function() {
		modal.style.display = "none";
        if (typeof loginUserName != "undefined")
            menu('settings');
        else    
            menu('welcome');
	}
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
            if (typeof loginUserName != "undefined")
                menu('settings');
            else    
			    menu('welcome');
		}
		$(document).keydown(function(event){
			if (event.keyCode == 27) 
			{
				modal.style.display = "none";
                if (typeof loginUserName != "undefined")
                menu('settings');
            else    
			    menu('welcome');
			}
		});
	}
};


// Registration
function Registration() {
	let userName = document.getElementById("r_username_ID").value;
	let password = document.getElementById("r_password_ID").value;

	localStorage.setItem(userName, password);
	menu("welcome'");
};

// Login
function Login (){
	loginUserName = document.getElementById("l_username_ID").value;
	menu("settings");
}

// Settings
function increaseValue() {
	var value = parseInt(document.getElementById('number').value, 10);
	value = isNaN(value) ? 0 : value;
	value++;
	document.getElementById('number').value = value;
};
  
function decreaseValue() {
	var value = parseInt(document.getElementById('number').value, 10);
	value = isNaN(value) ? 0 : value;
	value < 1 ? value = 1 : '';
	value--;
	document.getElementById('number').value = value;
};

function RandomSettings(){
	document.getElementById('downArrow').value = "Down Arrow";
	document.getElementById('upArrow').value = "Up Arrow";
	document.getElementById('leftArrow').value = "Left Arrow";
	document.getElementById('rightArrow').value = "Right Arrow";

	let amountBalls = Math.floor(Math.random() * (90 - 50 + 1) + 50);
	document.getElementById('ballsNumber').value = amountBalls;
    document.getElementById('rangeInput_b_ID').value = amountBalls;

	let firstColor = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
	document.getElementById('colorOne_ID').value = firstColor;
	let secondColor = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
	document.getElementById('colorTwo_ID').value = secondColor;
	let thirdColor = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
	document.getElementById('colorThree_ID').value = thirdColor;

	let gameTime = Math.floor(Math.random() * 101 + 60);
	document.getElementById('number').value = gameTime;

	let amountMonsters = Math.floor(Math.random() * 4 + 1)
	document.getElementById('amountMonsters').value = amountMonsters;
    document.getElementById('rangeInput_m_ID').value = amountMonsters;
};

function SaveSettings(){
	leftKey =  document.getElementById("leftArrow").value;
	rightKey = document.getElementById("rightArrow").value;
	downKey = document.getElementById("downArrow").value;
	upKey = document.getElementById("upArrow").value;

	amountBalls = document.getElementById("ballsNumber").value;

	color5pt = document.getElementById("colorOne_ID").value;
	color15pt = document.getElementById("colorTwo_ID").value;
	color25pt = document.getElementById("colorThree_ID").value;

	gameTime = document.getElementById("number").value;

	amountMonsters = document.getElementById("amountMonsters").value;
}

function ChangeKeysSetting (data){
	let keyChosen;
	let keyString;
	$(document).keydown(function(event){
		keyChosen = event.keyCode;
		keyString = CheckKey(keyChosen);

		if (data == "Down"){
			document.getElementById("downArrow").value = keyString;
			downKey = keyString;
		}
		else if (data == "Up"){
			document.getElementById("upArrow").value = keyString;
			upKey = keyString;
		}
		else if (data == "Right"){
			document.getElementById("rightArrow").value = keyString;
			rightKey = keyString;
		}
		else if (data == "Left"){
			document.getElementById("leftArrow").value = keyString;
			leftKey = keyString;
		}
		$(document).unbind();
	});
}

function CheckKey (key){ 
	if (key == 37){
		return "Left Arrow";
	}
	else if (key == 38){
		return "Up Arrow";
	}
	else if (key == 39){
		return "Right Arrow";
	}
	else if (key == 40){
		return "Down Arrow";
	}
	return String.fromCharCode(event.keyCode);
}	