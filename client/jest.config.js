module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    transformIgnorePatters: [
        'node_modules(?!axios)',
    ],
    moduleNameMapper: {
        "^axios$": require.resolve('axios')
    },
}