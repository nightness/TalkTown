#!/usr/bin/env bash

    echo 'Fixing PropTypes issues, for running expo start:web (for web)'
    echo "for reference: https://github.com/necolas/react-native-web/issues/1537"

    IMPORTS_REACT_NATIVE_WEB=('ViewPropTypes' 'ColorPropType' 'EdgeInsetsPropType' 'PointPropType' 'requireNativeComponent')
    for import in "${IMPORTS_REACT_NATIVE_WEB[@]}"
    do
        echo "Fixing react.native.web: $import ..."
        if grep -q "export const $import = { style: null };" ./node_modules/react-native-web/dist/index.js; then
            echo "$import fixed already!"
        else
            echo -e "\nexport const $import = { style: null };">> ./node_modules/react-native-web/dist/index.js
        fi
    done

    echo "Fixing react-native-snap-carousel ..."
    cp -rf fixes/react-native-snap-carousel node_modules/react-native-snap-carousel

    exit 0