const fs = require('fs')
const path = require('path')
const os = require('os')

function* walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name))
    } else if (file.name.includes('entries.json')) {
      yield path.join(dir, file.name)
    }
  }
}

for (const filePath of walkSync(process.argv[2])) {
  let rawdata = fs.readFileSync(filePath)
  let entries = JSON.parse(rawdata)
  
  entries.forEach((entry) => {
    let entryMD = ''

    if (entry.title != undefined) entryMD += '# ' + entry.title + os.EOL

    entryMD += os.EOL

    if (entry.content != undefined) entryMD += entry.content + os.EOL

    if (entry.attachments != undefined) {
      entryMD += os.EOL

      if (
        (entryMD +=
          entry.attachments[Object.keys(entry.attachments)[0]].sourceUrl !=
          undefined)
      ) {
        entryMD +=
          entry.attachments[Object.keys(entry.attachments)[0]].sourceUrl +
          os.EOL
      }
      entryMD += os.EOL

      if (
        (entryMD +=
          entry.attachments[Object.keys(entry.attachments)[0]].imageUrl !=
          undefined)
      ) {
        entryMD +=
          '![' +
          entry.attachments[Object.keys(entry.attachments)[0]].uid +
          '[(' +
          entry.attachments[Object.keys(entry.attachments)[0]].imageUrl +
          ')' +
          os.EOL
      }

      entryMD += os.EOL

      if (
        (entryMD +=
          entry.attachments[Object.keys(entry.attachments)[0]].text !=
          undefined)
      ) {
        entryMD +=
          entry.attachments[Object.keys(entry.attachments)[0]].text + os.EOL
      }

      entryMD += os.EOL

      if (
        (entryMD +=
          entry.attachments[Object.keys(entry.attachments)[0]].description !=
          undefined)
      ) {
        entryMD +=
          entry.attachments[Object.keys(entry.attachments)[0]].description +
          os.EOL
      }
    }

    fs.writeFile(__dirname + '\\' + entry.id + ".md", entryMD, (err) => {
      if (err) {
        console.error(err)
      }
    })
  })
}
