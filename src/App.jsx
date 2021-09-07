import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const rows = [
    ['红色', '黑色'],
    ['皮革', '纺织布'],
    ['中国', '美国', '俄罗斯'],
  ];

  // 所有可卖商品
  const products = [
    ['红色', '皮革', '中国'],
    ['红色', '纺织布', '中国'],
    ['黑色', '纺织布', '美国'],
    ['黑色', '纺织布', '俄罗斯'],
  ];

  // 用户选项
  let initialSelectTypes = [];
  for (let i = 0; i < rows.length; i++) {
    initialSelectTypes[i] = '';
  }

  // 用户已经选择的项
  const [selectTypes, setSelectTypes] = useState(initialSelectTypes);

  // 扁平化所有可选项
  const flatRows = rows.flat();

  // 所有可选项的长度
  const flagRowsLength = flatRows.length;

  // 获得矩阵
  const getMatrix = () => {
    // 创建矩阵 不能使用引用类型去创建矩阵 修改时会修改一列！！
    // const matrix = new Array(flagRowsLength).fill(new Array(flagRowsLength).fill(0));

    // 创建矩阵
    let matrix = [];
    for (let i = 0; i < flagRowsLength; i++) {
      matrix[i] = [];

      for (let j = 0; j < flagRowsLength; j++) {
        matrix[i][j] = 0;
      }
    }

    // 利用可卖商品去填充矩阵
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      for (let j = 0; j < product.length; j++) {
        // 首位商品名
        const prod = product[j];

        // 横纵方向的首位坐标
        const flatRowsIndexOfProd = flatRows.indexOf(prod);

        // 除去首位商品名 剩余的商品名
        const otherProds = product.filter((item) => item !== prod);

        for (let i = 0; i < otherProds.length; i++) {
          const otherProd = otherProds[i];

          const flatRowsIndexOfOtherProd = flatRows.indexOf(otherProd);
          matrix[flatRowsIndexOfProd][flatRowsIndexOfOtherProd] = 1;
        }
      }
    }

    return matrix;
  };

  const matrix = getMatrix();
  console.table(matrix);

  function getCanSelectTypes(selectTypes, products) {
    let canSelectTypes = [];

    // 初始值
    if (selectTypes.every((item) => item === '')) {
      // 将products扁平化 再过滤重复项
      const flatProducts = products.flat();
      canSelectTypes = [...new Set(flatProducts)];
    } else {
      // 重要！！！！
      // 首先把selectTypes挤挤 有值的往前推移 使用sort
      const forwardSelectTypes = selectTypes.slice().sort((a, b) => {
        if (a && b) {
          return 1;
        }

        if (a && !b) {
          return -1;
        }

        if (!a && b) {
          return 1;
        }

        if (!a && !b) {
          return 0;
        }
      });

      // forwardSelectTypes转成矩阵
      const forwardMatrix = forwardSelectTypes.filter(Boolean).map((item) => {
        const index = flatRows.indexOf(item);
        return matrix[index];
      });

      // 初始值用于累加计算
      let initialCanSelectTypes = [];
      for (let i = 0; i < flatRows.length; i++) {
        initialCanSelectTypes[i] = 1;
      }

      canSelectTypes = forwardMatrix
        .reduce((acc, cur) => {
          for (let i = 0; i < acc.length; i++) {
            acc[i] = acc[i] & cur[i];
          }

          return acc;
        }, initialCanSelectTypes)
        .map((item, index) => {
          if (item === 1) {
            return flatRows[index];
          }
        })
        .filter(Boolean);
    }

    return canSelectTypes;
  }

  // 计算可选项
  const canSelectTypes = getCanSelectTypes(selectTypes, products);

  // 点击选项
  const clickType = (index, type) => {
    // let newSelectTypes = selectTypes.slice();
    let newSelectTypes = JSON.parse(JSON.stringify(selectTypes));
    console.log('%c newSelectTypes before ⧭', 'color: #86bf60', newSelectTypes);

    if (newSelectTypes[index] === '') {
      newSelectTypes[index] = type;
    } else {
      if (newSelectTypes[index] === type) {
        // 引用问题 直接移除index元素
        // newSelectTypes[index] === '';
        newSelectTypes.splice(index, 1, '');
      } else {
        newSelectTypes[index] = type;
      }
    }

    console.log('%c newSelectTypes after ⧭', 'color: #d0bfff', newSelectTypes);
    setSelectTypes(newSelectTypes);
  };

  return (
    <div className="App">
      {rows.map((types, index) => {
        return (
          <div className="row" key={types}>
            {types.map((type) => {
              const isSelect = selectTypes.includes(type);
              const canSelect = canSelectTypes.includes(type);

              return (
                <button className={'type ' + `${isSelect ? 'select ' : ''}` + `${!isSelect ? (canSelect ? '' : 'disabled') : ''}`} key={type} onClick={() => clickType(index, type)}>
                  {type}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;
