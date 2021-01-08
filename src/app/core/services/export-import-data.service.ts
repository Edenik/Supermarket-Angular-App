import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportImportDataService {

  constructor() { }
  json: object;

  uploadJson(event) {
    const fileToLoad = event.target.files[0];
    const fileReader = new FileReader();
    return new Promise<any>((resolve, reject) => {
      fileReader.onload = function (fileLoadedEvent) {
        const textFromFileLoaded = fileLoadedEvent.target.result;
        const json = JSON.parse(String(textFromFileLoaded));
        resolve(json)
      };
      fileReader.readAsText(fileToLoad, "UTF-8");
    })
  }

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  dynamicDownloadJson(item, name) {
    this.dyanmicDownloadByHtmlTag({
      fileName: `${name}.json`,
      text: JSON.stringify(item)
    });
  }

  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

}
