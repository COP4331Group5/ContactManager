var urlBase = 'http://COP4331-4.com/LAMPAPI';
var extension = "php";

var userId = 0;

function doLogin(type)
{
	userId = 0;
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;

  if(type == 1)
	{
		login = document.getElementById("signupName").value;
		password = document.getElementById("signupPassword").value;
  }

	// document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;

		if( userId < 1 )
		{
			// document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		document.getElementById("loginName").value = "";
		document.getElementById("loginPassword").value = "";


    // will have to load contacts, set contact id attributes
		hideOrShow( "loggedInDiv", true);
		hideOrShow( "loginDiv", false);
		hideOrShow( "signupDiv", false);
		loadContacts();
	}
	catch(err)
	{
		alert("Error: Incorrect username or password!");
		goToLogin();
		document.getElementById("loginName").focus();
		return;
	}

}

function doLogout()
{
	userId = 0;

	goToLogin();
}

function loginCheck()
{
	var name = document.getElementById("loginName");
  var password = document.getElementById("loginPassword");

	if (name.value == "")
	{
		alert("Error: Must enter a username!");
	  password.focus();
    name.focus();
	}
	else if (password.value == "")
	{
		alert("Error: Must enter a password!");
		confirm.focus();
    password.focus();
	}
	else
	{
		doLogin();
	}
}

function goToLogin()
{
	document.getElementById("signupName").value = "";
  document.getElementById("signupPassword").value = "";
	document.getElementById("confirmPassword").value = "";
	document.getElementById("loginName").value = "";
  document.getElementById("loginPassword").value = "";

	hideOrShow( "loginDiv", true);
	hideOrShow( "loggedInDiv", false);
	hideOrShow( "signupDiv", false);
}

function goToSignup()
{
	hideOrShow( "signupDiv", true);
	hideOrShow( "loginDiv", false);
	hideOrShow( "loggedInDiv", false);
}

function signupCheck()
{
	var name = document.getElementById("signupName");
  var password = document.getElementById("signupPassword");
	var confirm = document.getElementById("confirmPassword");

	if (name.value == "")
	{
		alert("Error: Must enter a username!");
		confirm.focus();
	  password.focus();
    name.focus();
	}
	else if (password.value == "")
	{
		alert("Error: Must enter a password!");
		confirm.focus();
    password.focus();
	}
	else if (confirm.value == "")
	{
		alert("Error: Must confirm password!");
		confirm.focus();
    password.focus();
	}
	else if(password.value != confirm.value)
	{
		alert("Error: Passwords do not match!");
		confirm.focus();
	  password.focus();
	}
	else
	{
		createUser();
	}
}

function createUser()
{
  var login = document.getElementById("signupName").value;
  var password = document.getElementById("signupPassword").value;

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Signup.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//alert("User has been added");
			}
		};

		xhr.send(jsonPayload);

		doLogin(1);
	}
	catch(err)
	{
		alert("Error: Username already in use!");
		goToSignup();
		return;
	}
}

function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}
function loadContacts()
{
	var url = urlBase + '/Search.' + extension;
	var jsonPayload = '{"userID" : "' + userId + '","name": "","phone": "","email": ""}';
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		if(jsonObject.id == 0)
			return;

		var i = 0;
		var contactIndex;

		for(contactIndex = 1; contactIndex <= jsonObject.results.length/3; contactIndex++)
		{
			var nameID = "name" + contactIndex;
			var phoneID = "phone" + contactIndex;
			var emailID = "email" + contactIndex;
			var contactDivID = "contact" + contactIndex;
			document.getElementById(nameID).innerHTML = jsonObject.results[i++];
			document.getElementById(phoneID).innerHTML = jsonObject.results[i++];
			document.getElementById(emailID).innerHTML = jsonObject.results[i++];
			document.getElementById( contactDivID ).style.display = "block";
		}

	}
	catch(err)
	{
		alert(err.message);
	}

}
function addContact()
{
	var newName = document.getElementById("name").value;
  var newPhone = document.getElementById("phone").value;
  var newEmail = document.getElementById("email").value;

	document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";

	// document.getElementById("colorAddResult").innerHTML = "";

	var jsonPayload = '{"name" : "' + newName + '", "phone" : "' + newPhone + '", "email" : "' + newEmail + '", "userID" : ' + userId + '}';
	var url = urlBase + '/Add.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// change this to add contact HTML and display all the contacts
				// document.getElementById("colorAddResult").innerHTML = "Color has been added";
				hideOrShow("addContactDiv", false);
				hideOrShow("loggedInDiv", true);
				loadContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
		return;
	}

}
function deleteContact(contactId)
{
  // will probably unique ID from contact HTML
	var nameID = "name" + contactId;
	var phoneID = "phone" + contactId;
	var emailID = "email" + contactId;
	var contactTrID = "contact" + contactId;

	var nameStr = document.getElementById(nameID).innerHTML;
	var phoneStr = document.getElementById(phoneID).innerHTML;
	var emailStr = document.getElementById(emailID).innerHTML;

	var url = urlBase + '/Delete.' + extension;
	var jsonPayload = '{"name" : "' + nameStr + '", "phone":"' + phoneStr + '", "email":"' + emailStr + '",  "userID" :' + userId + '}';
	document.getElementById( contactTrID ).style.display = "none";
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

	}
	catch(err)
	{
		alert(err.message);
		return;
	}
}
function searchContact()
{
  // might have to make all html in one page to preserve userId, otherwise new document will reset it's id to 0
	var nameSearch = document.getElementById("nameSearch").value;
	var phoneSearch = document.getElementById("phoneSearch").value;
	var emailSearch = document.getElementById("emailSearch").value;


	var searchResults = document.getElementById("searchResults");
	searchResults.innerHTML = "";
	var jsonPayload = '{"userID" : "' + userId + '", "name" : "' + nameSearch + '", "phone" : "' + phoneSearch + '", "email" : "' + emailSearch + '"}';

	var url = urlBase + '/Search.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );

				var i;
				for( i=0; i<jsonObject.results.length; i++ )
				{
					var contactResult = document.createElement("div");
					contactResult.innerHTML = jsonObject.results[i];
					searchResults.appendChild(contactResult);
					if(i%3 == 2)
					{
						var contactBr = document.createElement("br");
						searchResults.appendChild(contactBr);
					}
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert(err.message);
		return;
	}

}
