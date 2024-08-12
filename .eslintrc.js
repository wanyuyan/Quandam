module.exports = {
    env: {
        node: true,
        browser: true,
        es2021: true
    },
    extends: [
        'react-app',
        '@ecomfe/eslint-config'  // 继承npm上共享配置
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'react-hooks',
        'jsx-a11y'
    ],
    rules: {
        'no-console': 'error',
        'indent': ['error', 4, {'SwitchCase': 1}],  // 强制四格风格
        'no-unused-vars': 'off',                    // 关掉eslint no-unused-vars默认配置
        'import/no-unresolved': 'off',
        'react/jsx-uses-react': 2,                  // 屏蔽'React' is defined but never used错误
        'import/order': 'off',                      // 不需要引入顺序验证
        'comma-dangle': ['error', 'never'],         // 不允许最后多余的逗号
        'react-hooks/rules-of-hooks': 'error',      // 检查Hook的规则
        'react-hooks/exhaustive-deps': 'warn',      // 检查effect的依赖
        'max-params': ['warn', 8],                  // 方法最多8个参数
        'no-use-before-define': ['error', {'functions': false, 'variables': false}],    // 注意：方法和变量可以在使用之后定义！为了解决hooks中经常会出现的循环依赖的问题，不过要注意危险
        'react/jsx-no-bind': ['warn', {'allowArrowFunctions': true}],                   // 暂且允许箭头函数，来提升代码可读性
        'max-nested-callbacks': ['warn', 4],        // 循环最多4层，超过4层警告
        'react/require-default-props': 'off',       // 组件的非必填属性不要求一定有默认值
        'react/no-find-dom-node': 'off',            // 暂且允许使用react-dom的findDOMNode方法
        'babel/object-curly-spacing': 'off',
        'no-multi-spaces': 'off',
        'max-len': ['error', {'code': 120, 'ignoreComments': true}]
    }
};