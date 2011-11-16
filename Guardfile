# vim: set ft=ruby :

guard 'livereload', :apply_js_live => false do
  watch "css/style.css"
  watch "index.html"
  watch "conway.coffee" do
    %x{coffee -o js -bc conway.coffee}
    "js/conway.js"
  end
end
