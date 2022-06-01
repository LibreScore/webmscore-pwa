#!/bin/bash

#* STEP 0
sudo apt install moreutils -y
sudo npm i -g prettier prettier-plugin-svelte
I18N_PATH="./src/lib/i18n"
TRANSLATION_PERCENTAGE=0.9

#* STEP 1
shopt -s nullglob

for json in $I18N_PATH/*.json; do
    jsonname=${json##*/}
    jsonname=${jsonname%%\.*}
    for file in $I18N_PATH/*.json; do
        filename=${file##*/}
        filename=${filename%%\.*}
        langname=$(node -e "console.log(new Intl.DisplayNames(['$filename'], { type: 'language' }).of('$jsonname'));")
        jq '."'"$jsonname"'"="'"$langname"'"' $file | sponge $file
    done
done

#* STEP 2
skipped_languages=""
for file in $I18N_PATH/*.json; do
    if [[ $(awk "BEGIN {print $(jq length $file) < $TRANSLATION_PERCENTAGE*$(jq length $I18N_PATH/en.json)}") == 1 ]]; then
        filename=${file##*/}
        filename=${filename%%\.*}
        skipped_languages="$skipped_languages$filename "
    fi
done

#* STEP 3
map_first_line=$(awk '/'"languageMap = \{"'/,/'"\};"'/ {printf NR "\n"}' src/routes/__layout.svelte | head -n 1)
map_last_line=$(awk '/'"languageMap = \{"'/,/'"\};"'/ {printf NR "\n"}' src/routes/__layout.svelte | tail -n 1 | head -n 1)
sed -i "${map_first_line},${map_last_line}d" src/routes/__layout.svelte
sed -i "${map_first_line}i let languageMap = {" src/routes/__layout.svelte

items_first_line=$(awk '/'"languageItems = \["'/,/'"\];"'/ {printf NR "\n"}' src/routes/__layout.svelte | head -n 1)
items_last_line=$(awk '/'"languageItems = \["'/,/'"\];"'/ {printf NR "\n"}' src/routes/__layout.svelte | tail -n 1 | head -n 1)
sed -i "${items_first_line},${items_last_line}d" src/routes/__layout.svelte
sed -i "${items_first_line}i languageItems = [" src/routes/__layout.svelte

i18n_first_line=$(awk '/'"loaders: \["'/,/'"\],"'/ {printf NR "\n"}' src/lib/i18n/i18n.ts | head -n 1)
i18n_last_line=$(awk '/'"loaders: \["'/,/'"\],"'/ {printf NR "\n"}' src/lib/i18n/i18n.ts | tail -n 1 | head -n 1)
sed -i "${i18n_first_line},${i18n_last_line}d" src/lib/i18n/i18n.ts
sed -i "${i18n_first_line}i loaders: [" src/lib/i18n/i18n.ts

for file in $I18N_PATH/*.json; do
    filename=${file##*/}
    filename=${filename%%\.*}
    if ! [[ " $skipped_languages " =~ " $filename " ]]; then
        langname=$(node -e "console.log(new Intl.DisplayNames(['$filename'], { type: 'language' }).of('$filename'));")
        direction=$(node -e "if (new RegExp('^[^\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]*?[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]').test('$langname')) {console.log('rtl')} else {console.log('ltr')};")
        sed -i "${map_first_line}s"'/$/'"${langname}: ['$filename', '$direction'],"'/' src/routes/__layout.svelte
        sed -i "${items_first_line}s"'/$/'"{ $langname: \$t('$filename') },"'/' src/routes/__layout.svelte
        sed -i "${i18n_first_line}s"'/$/'"{locale: '$filename',key: '',loader: async () => (await import('.\/$filename.json')).default},"'/' src/lib/i18n/i18n.ts
    fi
done
sed -i "${map_first_line}s"'/$/'"};"'/' src/routes/__layout.svelte
sed -i "${items_first_line}s"'/$/'"];"'/' src/routes/__layout.svelte
sed -i "${i18n_first_line}s"'/$/'"],"'/' src/lib/i18n/i18n.ts

#* STEP 4
prettier --write ./src/lib/i18n/i18n.ts
prettier --write ./src/routes/__layout.svelte

shopt -u nullglob

exit 0
