const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const PackageJSON = require('./package.json')
const ManifestJSON = require('./chrome/manifest.json')

const resolve = dir => path.resolve(__dirname, dir)
const versionReg = /(\d+\.\d+\.\d+)/g
const currentVersion = PackageJSON.version

function build() {
  // 打包成chrome插件
  execSync(`cp dist/bundle.js chrome/bundle.js`)
  ManifestJSON.version = currentVersion
  fs.writeFileSync(resolve('chrome/manifest.json'), JSON.stringify(ManifestJSON, null, 2), 'utf8')
  console.log('build complete!')
}
build()
