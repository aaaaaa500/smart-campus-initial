import fs from "node:fs";
import path from "node:path";

// word = text we search for / word = текст, который ищем
const word = "bookings.filter";

// walk = go through every folder and file / walk = обходит все папки и файлы
// dir = current folder / dir = текущая папка
function walk(dir) {
  // name = name of a file or subfolder / name = имя файла или подпапки
  for (const name of fs.readdirSync(dir)) {
    // full = full path / full = полный путь
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else {
      // lines = all lines of the file / lines = все строки файла
      const lines = fs.readFileSync(full, "utf8").split("\n");
      // line = one line, i = its index from 0 / line = одна строка, i = её номер с нуля
      lines.forEach((line, i) => {
        if (line.includes(word)) {
          console.log(full + ":" + (i + 1) + ": " + line.trim());
        }
      });
    }
  }
}

walk("src");

// appLines = number of lines in App.tsx / appLines = число строк в App.tsx
const appLines = fs.readFileSync("src/App.tsx", "utf8").split("\n").length - 1;
console.log("App.tsx lines: " + appLines);