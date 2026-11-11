const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "Ji.js"), "utf8");

function loadWithElement(element) {
  const context = vm.createContext({
    document: {
      getElementById(id) {
        assert.equal(id, "more-info");
        return element;
      },
    },
  });
  vm.runInContext(source, context);
  return context.showMore;
}

test("showMore() reveals #more-info when initially hidden", () => {
  const element = { style: { display: "none" } };
  const showMore = loadWithElement(element);
  showMore();
  assert.equal(element.style.display, "block");
});

test("calling showMore() again hides #more-info", () => {
  const element = { style: { display: "none" } };
  const showMore = loadWithElement(element);
  showMore();
  showMore();
  assert.equal(element.style.display, "none");
});

test("showMore() sets display to none when display is unset", () => {
  const element = { style: { display: "" } };
  const showMore = loadWithElement(element);
  showMore();
  assert.equal(element.style.display, "none");
});
