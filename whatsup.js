
var model = function()
{
	this.shown = {};

	this.topic = ko.observable("ladygaga");
	this.timestamp = ko.observable("");
	this.description = ko.observable("Loading...");
	this.imagesrc = ko.observable(""); // "http://twitpic.com/show/full/cal39q";
	
	this.refresh = function()
	{
		m.getFeed();
		setTimeout(m.refresh, 10000);
	}

	this.parseResult = function(result)
	{
		console.log("parseResult()");
       		if (!result.error) 
		{
			console.log(result.feed.entries.length + " entries in feed");

       	   		for (var i = 0; i < result.feed.entries.length; i++) 
			{
            			var entry = result.feed.entries[i];

				m.description(entry.author + ": " + entry.title);

				// get image 
				var imgRegEx = new RegExp('src\s*=\s*"([^"]+)');
				var matches = imgRegEx.exec(entry.content);
				var thumb = matches[1];
				// console.log("thumb src='" + thumb + "'");
				var fullImage = thumb.replace("thumb", "full");
				m.imagesrc(fullImage);
				

				// get timestamp
				var pubTime = Date.parse(entry.publishedDate);


				// Mon, 11 Mar 2013 15:42:18 -0700
				m.timestamp(m.formatTimestamp(pubTime));


				if (m.shown[entry.publishedDate])
				{
					continue;
				}
				else
				{
					m.shown[entry.publishedDate] = true;
					break;
				}

          		}
		}
	}

	this.formatTimestamp = function(timestamp)
	{
		console.log(timestamp);

		var curTime = (new Date()).getTime();
		console.log("current time = " + curTime);

		return Math.round((curTime - timestamp) / (60*1000)) + " minutes ago";
	}

	this.getFeed = function()
	{
  		var salt = (new Date()).getTime();

		console.log("getFeed()");
		var url = "http://twitcaps.com/rss/" + this.topic() + "?x=" + salt;
		console.log("Get feed " + url);

  		var feed = new google.feeds.Feed(url);
		feed.setNumEntries(20);
		feed.load(this.parseResult);
	}

} 

function ExpandPhoto() {	
	var headerHeight = 80;
	var buffer = 10;
	var optimalHeight = $(window).height() - headerHeight - buffer;
	$('.container').height(optimalHeight);
	
	$('#photo').load(function(){
		var imgClass = (this.width/this.height >= $('.container').width/$('.container').height) ? 'wide' : 'tall';
		$(this).addClass(imgClass);	
	});
}

function onGoogleReady()
{
	m.refresh();
	ko.applyBindings(m);
	ExpandPhoto();	
}                                   

var m = new model();
google.load("feeds", "1");
google.setOnLoadCallback(onGoogleReady);

