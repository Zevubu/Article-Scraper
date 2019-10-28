$(document).ready(function(){
    const articleContainer = $(".article-container");

    function handleArticleSave(){
        let articleToSave = $(this).parents(".card").data();
        $(this).parents(".card").remove();

        articleToSave.saved = true;
        console.log(articleToSave);

        $.ajax({
            method:"PUT",
            url:"/api/headlines/" + articleToSave. _id,
            data: articleToSave
        })
        .then(function (data){
            console.log(data);
            if (data){
                location.reload();
            }
        });
    };


    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", "scrape-new", handleArticlescrape);
    $(".clear").on("click", handleArticleClear);

    function createCard(article){
        const card = $(`<section class="card">`).append(
        )

    }
    // x
    function createCard(article) {
        var card = $("<div class='card'>");
        var cardHead = $("<div class='card-header'>").append(
        $("<h3>").append(
        $("<a class='article-link; targer='_blank' rel='noopener noreferrer'>")
        .attr("href", article.url)
        .text(article.headline),
        $("<a class='btn btn-success save'>Save Article</a>")
        )
    );



    function renderArticles(articles){
        const articleCard = [];

        for(let i = 0; i< articles.length; i++){
            articleCard.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
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

   
})