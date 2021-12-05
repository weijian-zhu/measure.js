import Rect from './rect';
import { LineBorder, Direction } from './type';

function createLine(
  width: number,
  height: number,
  top: number,
  left: number,
  text: string,
  border: LineBorder = 'none'
): void {
  let marker: HTMLSpanElement = document.createElement('span');
  marker.style.backgroundColor = '#ED5666';
  marker.style.position = 'fixed';
  marker.classList.add(`spacing-js-marker`);
  marker.style.width = `${width}px`;
  marker.style.height = `${height}px`;

  if (border === 'x') {
    marker.style.borderLeft = '1px solid rgba(255, 255, 255, .8)';
    marker.style.borderRight = '1px solid rgba(255, 255, 255, .8)';
  }

  if (border === 'y') {
    marker.style.borderTop = '1px solid rgba(255, 255, 255, .8)';
    marker.style.borderBottom = '1px solid rgba(255, 255, 255, .8)';
  }

  marker.style.pointerEvents = 'none';
  marker.style.top = `${top}px`;
  marker.style.left = `${left}px`;
  marker.style.zIndex = '9998';
  marker.style.boxSizing = 'content-box';

  let value: HTMLSpanElement = document.createElement('span');
  value.classList.add(`spacing-js-value`);
  value.style.backgroundColor = '#ED5666';
  value.style.color = 'white';
  value.style.fontSize = '10px';
  value.style.display = 'inline-block';
  value.style.fontFamily = 'Helvetica, sans-serif';
  value.style.fontWeight = 'bold';
  value.style.borderRadius = '20px';
  value.style.position = 'fixed';
  value.style.width = '42px';
  value.style.lineHeight = '15px';
  value.style.height = '16px';
  value.style.textAlign = 'center';
  value.style.zIndex = '10000';
  value.style.pointerEvents = 'none';
  value.innerText = text;
  value.style.boxSizing = 'content-box';

  if (border === 'x') {
    // 防止文字在屏幕外面
    let topOffset = top + height / 2 - 7;

      //超过屏幕高度
    if (topOffset > document.documentElement.clientHeight - 20) {
      topOffset = document.documentElement.clientHeight - 20;
    }
       //小于屏幕高度
    if (topOffset < 0) {
      topOffset = 6;
    }

    value.style.top = `${topOffset}px`;
    value.style.left = `${left + 6}px`;
  } else if (border === 'y') {
    // Prevent the badge moved outside the screen
    let leftOffset = left + width / 2 - 20;

    if (leftOffset > document.documentElement.clientWidth - 48) {
      leftOffset = document.documentElement.clientWidth - 48;
    }

    if (leftOffset < 0) {
      leftOffset = 6;
    }

    value.style.top = `${top + 6}px`;
    value.style.left = `${leftOffset}px`;
  }

  document.body.appendChild(marker);
  document.body.appendChild(value);
}

export function placeMark(
  rect1: Rect,
  rect2: Rect,
  direction: Direction,
  value: string,
  edgeToEdge: boolean = false
): void {
  

    //select dom 和 target dom 并集的情况
    if (edgeToEdge) {
        if(rect1.outsideAndNOIntersection(rect2)){
           //水平和垂直方向没有相交的情况
          console.log(111);
          // 水平方向
          {
            let top = (rect1.top + rect1.bottom) / 2
          // let left = Math.min(rect1.right,rect2.left)
          let left = rect1.left>rect2.right ? rect2.right : rect1.right
         
          let height = 1
          // let width = Math.abs(rect2.left - rect1.right)
          let width = Math.abs(rect1.left>rect2.right ? rect1.left - rect2.right :rect2.left - rect1.right)
          console.log(width);
          debugger
           createLine(width, height, top, left, value, 'y');
          }

          //垂直方向
          {
            let top = rect1.top>rect2.bottom ? rect2.bottom : rect1.bottom
          let left = (rect1.left + rect1.right) / 2
          let height = Math.abs(rect1.top>rect2.bottom ? rect1.top - rect2.bottom :rect2.top - rect1.bottom)
          let width = 1
          console.log(height);
          
          createLine(width, height, top, left, value, 'x');
          }
        }else{

        }


      return
    }


  //select dom 和 target dom 交集的情况
  if (direction === 'top') {
    let width: number = 1;
    let height: number = Math.abs(rect1.top - rect2.top);
    let left: number = Math.floor(
      (Math.min(rect1.right, rect2.right) + Math.max(rect1.left, rect2.left)) /
        2
    );
    let top: number = Math.min(rect1.top, rect2.top);

    // if (edgeToEdge) {
    //   if (rect1.top < rect2.top) {
    //     return;
    //   }
    //   // If not colliding
    //   if (rect1.right < rect2.left || rect1.left > rect2.right) {
    //     return;
    //   }
    //   height = Math.abs(rect2.bottom - rect1.top);
    //   top = Math.min(rect2.bottom, rect1.top);
    // }

    createLine(width, height, top, left, value, 'x');
  } else if (direction === 'left') {
    let width: number = Math.abs(rect1.left - rect2.left);
    let height: number = 1;
    let top: number = Math.floor(
      (Math.min(rect1.bottom, rect2.bottom) + Math.max(rect1.top, rect2.top)) /
        2
    );
    let left: number = Math.min(rect1.left, rect2.left);

    // if (edgeToEdge) {
    //   if (rect1.left < rect2.left) {
    //     return;
    //   }
    //   // If not overlapping
    //   if (rect1.bottom < rect2.top || rect1.top > rect2.bottom) {
    //     return;
    //   }
    //   width = Math.abs(rect1.left - rect2.right);
    //   left = Math.min(rect2.right, rect1.left);
    // }

    createLine(width, height, top, left, value, 'y');
  } else if (direction === 'right') {
    let width: number = Math.abs(rect1.right - rect2.right);
    let height: number = 1;
    let top: number = Math.floor(
      (Math.min(rect1.bottom, rect2.bottom) + Math.max(rect1.top, rect2.top)) /
        2
    );
    let left: number = Math.min(rect1.right, rect2.right);

    // if (edgeToEdge) {
    //   if (rect1.left > rect2.right) {
    //     return;
    //   }
    //   // If not overlapping
    //   if (rect1.bottom < rect2.top || rect1.top > rect2.bottom) {
    //     return;
    //   }
    //   width = Math.abs(rect1.right - rect2.left);
    // }

    createLine(width, height, top, left, value, 'y');
  } else if (direction === 'bottom') {
    let width: number = 1;
    let height: number = Math.abs(rect1.bottom - rect2.bottom);
    let top: number = Math.min(rect1.bottom, rect2.bottom);
    let left: number = Math.floor(
      (Math.min(rect1.right, rect2.right) + Math.max(rect1.left, rect2.left)) /
        2
    );

    // if (edgeToEdge) {
    //   if (rect2.bottom < rect1.top) {
    //     return;
    //   }
    //   // If not overlapping
    //   if (rect1.right < rect2.left || rect1.left > rect2.right) {
    //     return;
    //   }
    //   height = Math.abs(rect1.bottom - rect2.top);
    // }

    createLine(width, height, top, left, value, 'x');
  }
}

export function removeMarks(): void {
  document
    .querySelectorAll<HTMLSpanElement>('.spacing-js-marker')
    .forEach(function (element) {
      element.remove();
    });
  document
    .querySelectorAll<HTMLSpanElement>('.spacing-js-value')
    .forEach(function (element) {
      element.remove();
    });
}
