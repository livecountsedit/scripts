// ==UserScript==
// @name         refined lcedit sub gap thing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  it basically refines the lcedit sub gap thing in battles thats it
// @match        https://lcedit.com/*
// @match        https://lcedit.com/top50*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function fixSubGap() {


        const middle = document.querySelector('div[style*="text-align: center"]');
        if (!middle) return;


        const diffP = [...middle.querySelectorAll('p')]
            .find(p => p.textContent.trim() === 'Difference:');

        if (!diffP) return;


        diffP.textContent = 'SUB GAP';

        diffP.style.display = 'inline-block';
        diffP.style.padding = '4px 12px';
        diffP.style.borderRadius = '999px';
        diffP.style.backgroundColor = 'rgb(90, 30, 175)';
        diffP.style.color = '#fff';
        diffP.style.fontWeight = '700';
        diffP.style.fontSize = '16px';


        diffP.style.transform = 'scale(0.9)';
        diffP.style.transformOrigin = 'center';


        middle.style.display = 'flex';
        middle.style.flexDirection = 'column';
        middle.style.alignItems = 'center';
        middle.style.justifyContent = 'center';
        middle.style.gap = '4px';


        const numberBlock = document.querySelector('[id="battle_difference_Item 4"]');
        if (numberBlock) {
            numberBlock.style.transform = 'scale(1.2)';
            numberBlock.style.transformOrigin = 'center';
            numberBlock.style.display = 'inline-block';
        }
    }

    window.addEventListener('load', fixSubGap);

    const observer = new MutationObserver(fixSubGap);
    observer.observe(document.body, { childList: true, subtree: true });

})();
