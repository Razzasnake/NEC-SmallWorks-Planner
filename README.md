# tableandmap

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build -- --mode prod
git add -f dist && git commit -m "Update live website"
git subtree push --prefix dist origin gh-pages
git reset --hard HEAD^
```

### In case you commit dist
```
git filter-branch --tree-filter 'rm -rf dist' --prune-empty HEAD
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
