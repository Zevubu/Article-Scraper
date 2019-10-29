$(document).ready(function(){
    const articleContainer = $(".article-container");

    function createCard(article){
        let card = $(`<section class="card">`);
        let cardHead = $(`<section class="card-header">`).append(
            $('<h3>').append(
                $(`<a class="article-title" target="_blank" rel="noopener noreferrer">`)
                .text(article.headline),
                $("<a class='btn btn-success save'>Save Article</a>")

            )
        );
        let cardBody = $(`<div class="card-body"><a class="article-link"  target="_blank" rel="noopener noreferrer" href="${this.url}">${this.url}</a></div>`)
        card.append(cardHead,cardBody);
        card.data("_id",article._id);
        return card;

    }

    function renderEmpty(){
        let emptyAlert = 
        $([`<section class="alert alert-warning text-center">`,
        `<h4>The Data Base apears to be empty.</h4>`,
        `</section>`,
        `<section class="panel panel-default">`,
        `<section class="panel-heading text-center">`,
        `<h3> What would you like to do?</h3>`,
        `</section>`,
        `<section class="panel-body text-center">`,
        `<h4><a class="scrape-new">Scrape New Content</a></h4>`,
        `<h4><a href="/saved">View Saved Articles</a></h4>`,
        `</section>`,
        `</section>`
    ].join(""));
    articleContainer.append(emptyAlert);
    }

    function initPage(){
        $.get("/api/headlines?saved=false")
        .then(function(data){
            articleContainer.empty();

            if(data && data.length){
                renderArticles(data);
            }else{
                renderEmpty();
            }
        });
    }

    function renderArticles(articles){
        const articleCard = [];

        for(let i = 0; i< articles.length; i++){
            articleCard.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    };

    function handleArticleSave(){
        let articleToSave = $(this).parents(".card").data();
        $(this).parents(".card").remove();

        articleToSave.saved = true;
        console.log(articleToSave);

        $.ajax({
            method:"PUT",
            url:"/api/headlines/" + articleToSave._id,
            data: articleToSave
        })
        .then(function (data){
            console.log(data);
            if (data){
                location.reload();
            }
        });
    };

    function handleArticleScrape(){
        $.get("/api/fetch")
        .then(function (data){
            // initPage()
            console.log(`Scraped Data: ${data}`);
            window.location.href="/";
        });
    };

    function handleArticleClear(){
        $.get("api/clear").then(function(data){
            console.log(`Cleared Data: ${data}`);
            articleContainer.empty();
            location.reload();
        });
    };

    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    $(".clear").on("click", handleArticleClear);
});