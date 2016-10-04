
function loadData() {

    var $body = $('body');                                          //Can also replace with document.body
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    var url = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $('<img/>', {
        'class': 'bgimg',
        'src': url
    }).appendTo($body);

    var nyturl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityStr  + "&sort=newest&api-key=82a9fcdef0224d26b110473b3dbd1044";

    $.getJSON(nyturl, function(data) {
        var articles = data.response.docs;
        for(var i =0; i<articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class = "article"> '  +
                '<a href =  " '+article.web_url+' "  >' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        }
    }).error(function() {
        $nytHeaderElem.text("News could not be loaded");
    });

    var wikiUrl  = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallback";

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failer to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
            var articleList = response[1];
            for(var i = 0; i< articleList.length;i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' +  articleStr;
                $wikiElem.append('<li><a href = " ' + url + ' ">' + articleStr + '</a></li>');
            }

            clearTimeout(wikiRequestTimeout);
        }
    });


    return false;
}

$('#form-container').submit(loadData);
