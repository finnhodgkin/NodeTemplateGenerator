#!/usr/bin/env node
var fs = require('fs');
var prompt = require('prompt');

prompt.start();

if(process.argv[2]){                        //if extra command line
  if(process.argv[2] === "css"){            //if css
    prompt.get('stylesheet', (err,file)=>{
      if(err) console.error(err);
      writecss(file.stylesheet + ".css")
    })
  }else if(process.argv[2] === "js"){       //if js
    prompt.get('JSfile', (err,file)=>{
      if(err) console.error(err)
      writejs(file.JSfile + ".js")
    })
  }
}
else{                                       //default template
  prompt.get('file', (err, res)=>{          //filename
    if(err) console.error(err)
    read(res.file + ".html")
  })
}

function read(file){                        //check if file exists
  fs.readFile(file, (err, data)=>{
    if(err) return write(file)
    console.log("File exists")
  })
}

function write(file){                       //build html file
  var template =
  ["<!doctype html>\n", '<html lang="en">',
   '<head>', '  <meta charset="utf-8">']

  var promptSet = {                         //create prompts
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

  prompt.get(promptSet, (err, res)=>{       //get prompts
    if(err) console.error(err)

    template.push(                          //create variable header content
      ["\n  <title>", res.pageTitle, "</title>\n",
      '  <meta name="description" content="', res.pageTitle, '">\n',
      '  <meta name="author" content="', res.pageAuthor, '">\n\n'
      ].join(""))

    var css = res.cssName.split(" ")        //split + build multiple style sheet
    for(let i = 0; i < css.length; i++)
      template.push(['  <link rel="stylesheet" href="', css[i], '.css">\n'].join(""))

    if(res.includejQuery)                   //include jQuery?
      template.push('  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js">\n  </script>')

    if(res.customIncludes){                 //split + build javaScript includes
      customIncludes = res.customIncludes.split(" ")
      for(let i = 0; i < customIncludes.length; i++)
        template.push('  <script src="' + customIncludes[i] + '">\n  </script>')
    }

    if(res.includeShiv)                     //include IE shiv
      template.push('\n  <!--[if lt IE 9]>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script>\n  <![endif]-->\n')

    if(res.includeJS)                       //add footer and JS file
      template.push(
        ["</head>\n",
        "<body>\n",
        '  <script src="', res.includeJS, '.js"></script>\n',
        "</body>\n",
        "</html>"
      ].join(""))
    else template.push(                     //add just footer
        ["</head>\n",
        "<body>\n\n  ",
        "</body>\n",
        "</html>"
      ].join(""))

    template = template.join("\n");

    if(res.buildFiles)                      //build empty css and js?
      build(res.includeJS, css)

    create(file, template);
  })
}

function build(js, css){                    //build empty files
  if(js){
    js += ".js";
    testExists(js);
  }
  for(let i = 0; i < css.length; i++){
    css[i] = css[i] + ".css";
    testExists(css[i]);
  }
}

function testExists(file){                  //test files exist before building
  fs.readFile(file, (err, d)=>{
    if(err) return create(file);
    console.log(file + " exists");
  })
}

function create (file, content){            //build file
  if(!content) content = "";                //make content blank if none
  fs.writeFile(file, content, (err, d)=>{
    if(err) console.error(err)
    console.log(file + " created")
  })
}

function writecss (file){                   //build css reset file
  let template = [
    "html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {",
    "  margin: 0;",
    "  padding: 0;",
    "  border: 0;",
    "  font-size: 100%;",
    "  font: inherit;",
    "  vertical-align: baseline;",
    "}",
    "/* HTML5 display-role reset for older browsers */",
    "article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {",
    "	display: block;",
    "}",
    "body {",
    "	line-height: 1;",
    "}",
    "ol, ul {",
    "	list-style: none;",
    "}",
    "blockquote, q {",
    "	quotes: none;",
    "}",
    "blockquote:before, blockquote:after,q:before, q:after {",
    "	content: '';",
    "	content: none;",
    "}"
  ].join("\n");
  fs.writeFile(file, template, (err, d)=>{
    if(err) console.error(err)
    console.log("Resets added to " + file)
  })
}

function writejs (file){                    //build JS file
  let template = [
    'document.addEventListener("DOMContentLoaded", function() {',
    "",
    "}"
  ].join("\n");

  fs.writeFile(file, template, (err, d)=>{
    if(err) console.error(err)
    console.log("Added event listener to " + file)
  })
}
