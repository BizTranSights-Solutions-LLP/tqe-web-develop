$(document).ready(function () {
  // Add the following code if you want the name of the file appear on File Input
  // $(".custom-file-input").on("change", function() {
  //     var fileName = $(this).val().split("\\").pop();
  //     $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  // });


  // $('[data-toggle="popover"]').popover();


  // $('#first_table').DataTable({
  //     "dom": "<'table_wrap' rt><'table_footer' lp>",
  //     "autoWidth": false,
  //     "pageLength": 25,
  //     "language": {
  //         "info": "Shasdasdwing pagesdfds _PAGE_ of _PAGES_"
  //     }
  // });


  // $('#second_table').DataTable({
  //     "paging": false,
  //     "autoWidth": false,
  //     "searching": false,
  //     "info": false

  // });
  // $('#third_table').DataTable({
  //     "paging": false,
  //     "autoWidth": false,
  //     "searching": false,
  //     "info": false

  // });
  // $('.lineups-table').DataTable({
  //     "paging": false,
  //     "autoWidth": false,
  //     "searching": false,
  //     "info": false
  // });

  //With JQuery
  $(".lineups-range").slider({
    tooltip: 'always'
  });

  //Ion Range Slider
  $(".js-range-slider").ionRangeSlider({
    grid: true,
    min: 1,
    max: 150,
    from: 10,
    to: 130,
    prefix: ""
  });

  $(".js-range-slider_1").ionRangeSlider({
    type: "double",
    grid: true,
    min: 300,
    max: 500,
    from: 340,
    to: 500,
    prefix: "$"
  });



  $(".js-range-slider_2").ionRangeSlider({
    grid: true,
    min: 1,
    max: 10,
    from: 2,
    to: 9,
    prefix: ""
  });

  $(".js-range-slider_3").ionRangeSlider({
    grid: true,
    min: 0,
    max: 100,
    from: 2,
    to: 99,
    postfix: "%"
  });
  $(".js-range-slider_4").ionRangeSlider({
    type: "double",
    grid: true,
    min: 0,
    max: 100,
    from: 0,
    to: 100,
    postfix: "%"
  });
  $(".js-range-slider_13").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100,
    postfix: ""
  });
  $(".filter-button-wrap").click(function () {
    // $(".s_filter_process").fadeToggle(500);
  });

  $("#s_logo_toggle").click(function () {
    $(".s_main_logo").toggle();
  });

  $(".font_toggle").click(function () {
    $(this).find("i").toggleClass("fas fa-angle-down fas fa-angle-up");
  });

});

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
