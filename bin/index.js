#!/usr/bin/env node
var fs = require('fs');
var prompt = require('prompt');

prompt.start();

prompt.get('file', (err, res)=>{
  if(err) console.error(err)
  read(res.file + ".html")
})

function read(file){
  fs.readFile(file, (err, data)=>{
    if(err) return write(file)
    console.log("File exists")
  })
}

function write(file){
  var template =
  ["<!doctype html>\n", '<html lang="en">',
   '<head>', '  <meta charset="utf-8">']

  var promptSet = {
    properties: {
      pageTitle: { description: 'Page title' },
      pageAuthor: { description: 'Page author' },
      cssName: { description: 'Stylesheet name - multiple stylesheets separated spaces' },
      includeJS: { description: 'Javascript file name - blank to skip' },
      includejQuery: { description: 'Include jQuery - blank to skip' },
      customIncludes: { description: 'Custom JS includes (URLs separated by a space) - blank to skip'},
      includeShiv: { description: 'HTML5 Shiv for IE - blank to skip' },
      buildFiles: { description: 'Build script and / or stylesheets - blank to skip' }
    }
  };

  prompt.get(promptSet, (err, res)=>{
    if(err) console.error(err)

    template.push(
      ["\n  <title>", res.pageTitle, "</title>\n",
      '  <meta name="description" content="', res.pageTitle, '">\n',
      '  <meta name="author" content="', res.pageAuthor, '">\n\n'
      ].join("")
    )
    var css = res.cssName.split(" ")
    for(let i = 0; i < css.length; i++)
      template.push(['  <link rel="stylesheet" href="', css[i], '.css">\n'].join(""))

    if(res.includejQuery)
      template.push('  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js">\n  </script>')

    if(res.customIncludes){
      customIncludes = res.customIncludes.split(" ")
      for(let i = 0; i < customIncludes.length; i++)
        template.push('  <script src="' + customIncludes[i] + '">\n  </script>')
    }

    if(res.includeShiv)
      template.push('\n  <!--[if lt IE 9]>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>\n  <![endif]-->\n')

    if(res.includeJS)
      template.push(
        ["</head>\n",
        "<body>\n",
        '  <script src="', res.includeJS, '.js"></script>\n',
        "</body>\n",
        "</html>"
      ].join(""))
    else template.push(
        ["</head>\n",
        "<body>\n\n  ",
        "</body>\n",
        "</html>"
      ].join(""))

    template = template.join("\n");
    if(res.buildFiles)
      build(res.includeJS, css)

    create(file, template);
  })
}

function build(js, css){
  if(js){
    js += ".js";
    testExists(js);
  }
  for(let i = 0; i < css.length; i++){
    css[i] = css[i] + ".css";
    testExists(css[i]);
  }
}

function testExists(file){
  fs.readFile(file, (err, d)=>{
    if(err) return create(file);
    console.log(file + " exists");
  })
}

function create (file, content){
  if(!content) content = "";
  fs.writeFile(file, content, (err, d)=>{
    if(err) console.error(err)
    console.log(file + " created")
  })
}
