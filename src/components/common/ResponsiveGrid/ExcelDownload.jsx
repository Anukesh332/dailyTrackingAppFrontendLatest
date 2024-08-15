import React from 'react'
import * as XLSX from 'xlsx'
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate'
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap'
import downloadIcon from "../../../assets/images/download-icon.svg"
import "./ExcelDownload.css"
const ExcelDownload = (props) => {

  async function createDownLoadData() {
    if (props.data) {
      handleExport().then((url) => {
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute('href', url)
        downloadAnchorNode.setAttribute('download', props.fileName + '.xlsx')
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
      })
    }
  }

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
    }

    const wbout = XLSX.write(workbook, wopts)

    // The application/octet-stream MIME type is used for unknown binary files.
    // It preserves the file contents, but requires the receiver to determine file type,
    // for example, from the filename extension.
    const blob = new Blob([s2ab(wbout)], {
      type: 'application/octet-stream',
    })

    return blob
  }

  const s2ab = (s) => {
    // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
    // create an ArrayBuffer with a size in bytes
    const buf = new ArrayBuffer(s.length)

    //create a 8 bit integer array
    const view = new Uint8Array(buf)
    //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i)
    }

    return buf
  }

  const handleExport = () => {
    let finalData = []
    let lastcolumn = 'A'
    let obj = {}
    let columnNumber = 1;
    let cellLengthObj = {};

    let excelHeader = props.excelHeader ? props.excelHeader : []
    if (excelHeader) {
      finalData = [...finalData, ...excelHeader]
    }
    for (let row of props.headers) {
      // let key = row.column
      if ((props.downloadData && row.displayIndication != undefined) || (props.downloadTemplate && row.upload)) {
        let key = getExcelColumnName(columnNumber);
        obj[[key]] = row.displayName
        lastcolumn = key
        columnNumber++;
        cellLengthObj[key] = row.displayName.length;
      }
    }
    finalData.push(obj)

    props.data.forEach((item) => {
      let obj = {}
      columnNumber = 1;
      for (let row of props.headers) {
        // let key = row.column
        if (row.displayIndication != undefined) {
          let key = getExcelColumnName(columnNumber);
          let displayValue = row.formatter ? row.formatter(item[row.columnName], row, item) : item[row.columnName];
          obj[[key]] = displayValue;
          columnNumber++;
          cellLengthObj[key] = cellLengthObj[key] < item[row.columnName]?.length ? item[row.columnName].length : cellLengthObj[key];
        }
      }
      finalData.push(obj)
    })
    let excelFooter = props.excelFooter ? props.excelFooter : []
    if (excelFooter) {
      finalData = [...finalData, ...excelFooter]
    }

    //create a new workbook
    const wb = XLSX.utils.book_new()

    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
      autoFilter: true,
    })

    let merge = props.merge ? props.merge : []
    if (merge) {
      sheet["!merges"] = merge;
    }

    XLSX.utils.book_append_sheet(wb, sheet, 'Report')

    // binary large object
    // Since blobs can store binary data, they can be used to store images or other multimedia files.

    const workbookBlob = workbook2blob(wb)

    const dataInfo = {
      tbodyRange: `A${excelHeader.length + 2}:${lastcolumn}${finalData.length}`,
      theadRange: `A${excelHeader.length + 1}:${lastcolumn}${excelHeader.length + 1}`,
    }

    return addStyle(workbookBlob, dataInfo, cellLengthObj)
  }

  const addStyle = (workbookBlob, dataInfo, cellLengthObj) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
          fontFamily: 'Calibri',
          verticalAlignment: 'center',
        })

        for (let key in cellLengthObj) {
          sheet.column(key).width(cellLengthObj[key] + 2)
        }


        if (dataInfo.tbodyRange) {
          sheet.range(dataInfo.tbodyRange).style({
            border: 'thin',
            horizontalAlignment: 'left',
          })
        }

        sheet.range(dataInfo.theadRange).style({
          fill: '0577b',
          border: 'thin',
          bold: true,
          fontColor: 'FFFFFF',
          horizontalAlignment: 'left',
        })

      })

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob))
    })
  }

  return (
    <OverlayTrigger
      overlay={<Tooltip>Download</Tooltip>}
    ><Image src={downloadIcon}
      className='download-btn'
      onClick={() => {
        createDownLoadData()
      }}
      size='l'
      /></OverlayTrigger>
  )
}
function getExcelColumnName(columnNumber) {
  // To store result (Excel column name)
  let columnName = "";

  while (columnNumber > 0) {
    // Find remainder
    let rem = columnNumber % 26;

    // If remainder is 0, then a
    // 'Z' must be there in output
    if (rem === 0) {
      columnName = "Z" + columnName;
      columnNumber = Math.floor(columnNumber / 26) - 1;
    }
    else // If remainder is non-zero
    {
      columnName = (String.fromCharCode((rem - 1) + 'A'.charCodeAt(0))) + columnName;
      columnNumber = Math.floor(columnNumber / 26);
    }
  }
  // return columnName.reverse();
  return columnName;
  // Reverse the string and print result
  // document.write(columnName.reverse().join("")+"<br>");
}

export default ExcelDownload