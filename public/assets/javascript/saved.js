$(document).ready(function(){
    const articleContainer = $(".article-container");
   
    function createCard(article){
        let card = $(`<section class="card">`);
        let cardHead = $(`<section class="card-header">`).append(
            $('<h3>').append(
                $(`<a class="article-title" target="_blank" rel="noopener noreferrer">`)
                .text(article.headline),
                $("<a class='btn btn-secondary delete'>Delete From Saved</a>"),
                $("<a class='btn btn-dark notes'>Article Notes</a>")

            )
        );
        let cardBody = $(`<div class="card-body"><a class="article-link"  target="_blank" rel="noopener noreferrer" href="${this.url}">${this.url}</a></div>`)
        card.append(cardHead, cardBody);
        card.data("_id",article._id);
        return card;
    };

    function renderArticles(articles){
        let articleCards = [];
        for (var i = 0; i < articles.length; i++) {
          articleCards.push(createCard(articles[i]));
        }
        articleContainer.append(articleCards);
    };
    
    function renderEmpty(){
        let emptyAlert = $(
            [
              "<div class='alert alert-warning text-center'>",
              "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
              "</div>",
              "<div class='card'>",
              "<div class='card-header text-center'>",
              "<h3>Would You Like to Browse Available Articles?</h3>",
              "</div>",
              "<div class='card-body text-center'>",
              "<h4><a href='/'>Browse Articles</a></h4>",
              "</div>",
              "</div>"
            ].join(""));

        articleContainer.append(emptyAlert);
    };

    function renderNotesList(data){
        let notesToRender = [];
        let currentNote;
        if(!data.notes.length){
            console.log("no notes check")
            currentNote = $("<li class='list-group-item'>No notes for this article yet.</li>");
            notesToRender.push(currentNote);
        }else{
            console.log(`notes data: ${data.notes}`)
            for(let i = 0; i< data.notes.length; i++){

                currentNote = $("<li class='list-group-item note'>")
                .text(data.notes[i].noteText)
                .append($("<button class='btn btn-secondary note-delete'>x</button>"));
              currentNote.children("button").data("_id", data.notes[i]._id);
              notesToRender.push(currentNote);
            }
        }
        $(".notes-container").append(notesToRender);
    };

    function initPage(){
        $.get("/api/headlines?saved=true").then(function(data) {
            articleContainer.empty();
           
            if (data && data.length) {
              renderArticles(data);
            } else {
              renderEmpty();
            }
          });
    };

    function handleArticleDelete (){
        let articleToDelete = $(this).parents(".card").data();

        $(this).parents(".card").remove();
        console.log(articleToDelete._id);

        $ajax({
            method:"DELETE",
            url:`/api/headlines/${articleToDelete._id}`
        }).then(function(data){
            if (data){
                window.load = "/saved"
            }
        });
    };

    function handleArticleNotes(){
        console.log('handle Note check.')
        let currentArticle = $(this).parents(".card").attr("data-_id");
        let articleInfo = $(this).parents(".card").children().attr("class", "article-title").text();
        console.log(`article info: ${articleInfo}`);
        console.log(`Article id: ${currentArticle}`)
        $.get("/api/notes/"+ currentArticle).then(function(data){
            // if(err){
            //     console.log(err)
            // }else{
                // console.log(`this data:${data}`);
                // console.log('check')


                let modalText =  $("<div class='container-fluid text-center'>").append(
                    $("<h4>").text("Notes For Article: " + data.headline),
                    $("<hr>"),
                    $("<ul class='list-group note-container'>"),
                    $("<textarea placeholder='New Note' rows='4' cols='60'>"),
                    $("<button class='btn btn-success save'>Save Note</button>")
                );
                
                console.log(modalText);
                bootbox.dialog({
                    message: modalText,
                    closeButton:true
                });
                let noteData = {
                    _id: currentArticle,
                    notes: data || []
                };
                
                console.log(`Notes Data: ${JSON.stringify(noteData)}`);

                $(".btn.save").data("article", noteData);
                renderNotesList(noteData);
            // }
        });
    };

    function handleNoteSave(){
        let noteData;
        let newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
          noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
          console.log(`NewNote data:${JSON.stringify(noteData)}`);
          $.post("/api/notes", noteData).then(function() {
            bootbox.hideAll();
          });
        }
    };

    function handleNoteDelete(){
        let noteToDelete = $(this).data("_id");
        $.ajax({
          url: "/api/notes/" + noteToDelete,
          method: "DELETE"
        }).then(function() {
          bootbox.hideAll();
        });
    };

    function handleArticleclear(){
        $.get("api/clear")
        .then(function(data) {
          articleContainer.empty();
          location.reload();
        });
    };

    $(document).on("click",".btn.delete", handleArticleDelete);
    $(document).on("click",".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
    $(".clear").on("click", handleArticleclear);
});