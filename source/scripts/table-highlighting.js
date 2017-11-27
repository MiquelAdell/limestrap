if (screen.width < 500) {

  $("body").addClass("nohover");
  $("td, th")
    .attr("tabindex", "1")
    .on("touchstart", function() {
      $(this).focus();
    });

}
