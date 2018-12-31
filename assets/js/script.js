/**
 * Drag and drop quiz intended for an iBooks widget
 */

$(document).ready(function() {
  //initialize the quiz image
  var answersSlideImage = [];
  $(".wrapper")
    .find(".choice")
    .each(function(i) {
      var $this = $(this);
      var answerChoiceValueData = removeExtraSpace($this.data("target")).split(
        " "
      );
      for (index in answerChoiceValueData) {
        var answerChoiceValue = answerChoiceValueData[index];
        var $targetAnswer = $(
          '.answers-quizz  .target[data-accept="' + answerChoiceValue + '"]'
        );

        $this.draggable({
          //  use a helper-clone that is append to "body" so is not "contained" by a pane
          helper: function() {
            return $(this)
              .clone()
              .removeClass("choice")
              .addClass("img-responsive")
              .appendTo(".answers-quizz")
              .css({ zIndex: 10000 })
              .show();
          },
          cursor: "move",
          //revert: "invalid",
          containment: ".wrapper"
        });

        if ($targetAnswer.length > 0) {
          $targetAnswer.droppable({
            accept: '.choice[data-target~="' + answerChoiceValue + '"]',
            drop: function(event, ui) {
              if (!ui.draggable.hasClass("dropped") && !$(this).html().length) {
                //
                $(this).append(
                  $(ui.draggable)
                    .clone()
                    .removeClass("ui-draggable")
                    .removeClass("dropped")
                );

                /// get box category name
                var boxCategAnswer = $(this).data("box-category");

                ///check if all the box of the [boxCategAnswer] are fill
                var checkFillAllBox = true;
                $('.target[data-box-category="' + boxCategAnswer + '"]').each(
                  function() {
                    if (!$(this).html().length) {
                      checkFillAllBox = false;
                    }
                  }
                );

                if (checkFillAllBox) {
                  ///check if all the box of the [boxCategAnswer] are fill by the correct answer

                  var error_message = "";
                  var num = 1;
                  /// get all the answer  category name
                  $(
                    '.target[data-box-category~="' + boxCategAnswer + '"]'
                  ).each(function() {
                    //get the answer
                    var $boxAnswer = $(this).find(".choice");
                    var valCategoryCorrectData = removeExtraSpace(
                      $boxAnswer.data("category-correct")
                    ).split(" ");
                    var valCategoryBoxCorrectData = removeExtraSpace(
                      $boxAnswer.data("box-correct")
                    ).split(" ");

                    var hasCategoryCorrect = false;
                    var hasCategoryBoxCorrect = false;

                    for (index in valCategoryCorrectData) {
                      if (valCategoryCorrectData[index] == boxCategAnswer) {
                        hasCategoryCorrect = true;
                        break;
                      }
                    }
                    for (index in valCategoryBoxCorrectData) {
                      if (valCategoryCorrectData[index] == boxCategAnswer) {
                        hasCategoryBoxCorrect = true;
                        break;
                      }
                    }

                    if (!hasCategoryBoxCorrect || !hasCategoryCorrect) {
                      error_message +=
                        "<br>" +
                        "<b>élément " +
                        num +
                        "</b>: " +
                        $boxAnswer.data("error-msg");
                    }

                    num++;
                  });

                  // check error
                  if (error_message.length) {
                    $(this)
                      .parent()
                      .parent()
                      .parent()
                      .append(
                        ' <div class="row">' +
                          '<div id = "category-three-state" class= "col-xs-12" >' +
                          '<div class="alert alert-danger">' +
                          "<strong>" +
                          '<span class="glyphicon glyphicon-remove-sign"></span>&nbsp;&nbsp;Danger!</strong>' +
                          error_message +
                          "</div>" +
                          "</div >" +
                          "</div >"
                      );
                  } else {
                    $(this)
                      .parent()
                      .parent()
                      .parent()
                      .append(
                        ' <div class="row">' +
                          '<div id = "category-three-state" class= "col-xs-12" >' +
                          '<div class="alert alert-success">' +
                          "<strong>" +
                          '<span class="glyphicon glyphicon-ok-sign"></span>&nbsp;&nbsp;Success!</strong>' +
                          " Bravo à vous...bonne reponse! " +
                          "</div>" +
                          "</div >" +
                          "</div >"
                      );
                  }
                }
              }
              answersSlideImage.splice(
                answersSlideImage.indexOf(answerChoiceValue),
                1
              );
            }
          });
          answersSlideImage.push(answerChoiceValue);
        } else {
        }
      }
    });
  $("#id_btn_reset").on("click", function() {
    location.reload();
  });
});

var removeExtraSpace = function(str) {
  str = str.replace(/[\s]{2,}/g, " "); // Enlève les espaces doubles, triples, etc.
  str = str.replace(/^[\s]/, ""); // Enlève les espaces au début
  str = str.replace(/[\s]$/, ""); // Enlève les espaces à la fin
  return str;
};
