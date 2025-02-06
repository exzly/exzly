jQuery(() => {
  $('.display-date').html(moment().format('dddd, MMMM D, YYYY'));
  (function displayClock() {
    const currentTime = moment().format('h:mm [<small>]A[</small>]');
    const displayTime = $('.display-time').text();

    if (displayTime !== currentTime) {
      $('.display-time').html(currentTime);
    }

    setTimeout(displayClock, 1000);
  })();
});
