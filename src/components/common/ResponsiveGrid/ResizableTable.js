export const resizableColumn = (id) => {
  // Query the table
  const table = document.getElementById(id);
  if (table) {
    // console.log("in", table)
    // Query all headers
    const cols = table.querySelectorAll('th');

    let i = 0;
    // Loop over them
    [].forEach.call(cols, function (col) {
      ++i;
      let fixedColumn = false;
      if (col?.classList?.length>0 && col?.classList[0]=="fixed") {
        fixedColumn = true;
      }
      if (!fixedColumn) {
        // Create a resizer element
        // console.log("col", col);
        let resizer;
        if (col.children[1]?.classList[0] == "resizer") {
          resizer = col.children[1];
        } else {
          resizer = document.createElement('div');
          resizer.classList.add('resizer');
        }

        // Set the height
        // resizer.style.height = `${table.offsetHeight - 12}px`;
        // resizer.style.height = `${table.offsetHeight}px`;

        // Add a resizer element to the column
        col.appendChild(resizer);
        // console.log("resizer.style.height",resizer.style.height,col)
        if (col.style.width == "") {
          const styles = window.getComputedStyle(col);
          let w = parseInt(styles.width, 10);
          if (w == 0) {
            w = 100;
          }
          col.style.width = `${w}px`;
        }

        // Will be implemented in the next section
        createResizableColumn(col, resizer);
      }
    });
  }
}
const createResizableColumn = function (col, resizer) {
  // Track the current position of mouse
  let x = 0;
  let w = 0;

  const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;

    // Calculate the current width of column
    const styles = window.getComputedStyle(col);
    w = parseInt(styles.width, 10);

    // Attach listeners for document's events
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    resizer.classList.add('resizing');
  };

  const mouseMoveHandler = function (e) {
    // Determine how far the mouse has been moved
    const dx = e.clientX - x;

    // Update the width of column
    if ((w + dx) > 50) {
      col.style.width = `${w + dx}px`;
    }

  };

  // When user releases the mouse, remove the existing event listeners
  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    resizer.classList.remove('resizing');
  };

  resizer.addEventListener('mousedown', mouseDownHandler);
};