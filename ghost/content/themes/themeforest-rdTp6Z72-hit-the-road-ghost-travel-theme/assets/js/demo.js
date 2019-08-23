function hashChanged() {

  var match = location.hash.match(/#(.+)\/(.+)/i);
  if (match != null && match.length == 3) {

    var action = match[1]
    var value = match[2]

    if (action == 'change-layout') {
      var postClasses = ['posts-grid', 'posts-4-column-grid', 'posts-2-column-grid']
      var posts = document.getElementById('posts')

      for (var i=0; i<postClasses.length; i++) {
        posts.classList.remove(postClasses[i])
      }

      posts.classList.add('posts-' + value)
    }
  }
}

window.onhashchange = hashChanged
hashChanged()
