$(document).ready(function(){
    const articleContainer = $(".article-container");
   
    function createCard(article){

    };

    function renderArticles(articles){

    };
    
    function renderEmpty(){

    };

    function renderNotesList(data){

    };

    function initPage(){

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
        let currentArticle = $(this).parents(".card").data();

        console.log(currentArticle);

        $.get(`/api.notes/${currentArticle.id}`).then(function(data){
            console.log(data);

            let modalText =  $("<div class='container-fluid text-center'>").append(
                $("<h4>").text("Notes For Article: " + currentArticle._id),
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
                  _id: currentArticle._id,
                  notes: data || []
              };
              console.log(`Notes Data: ${JSON.stringify(noteData)}`);

              $(".btn.save").data("article", noteData);
              renderNotesList(noteData);
        });
    };

    function handleNoteSave(){

    };

    function handleNoteDelete(){

    };

    function handleArticleclear(){

    };


    $(document).on("click",".btn.delete", handleArticleDelete);
    $(document).on("click", "btn.notes", handleArticleNotes);
    $(document).on("click",".btn.delete", handleArticleDelete);
    $(document).on("click", "btn.save", handleNoteSave);
    $(document).on("click", "btn.note-delete", handleNoteDelete);
    $(".clear").on("click", handleArticleclear);


});