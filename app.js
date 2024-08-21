document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveSnippet');
    saveButton.addEventListener('click', saveSnippet);
    //escaping HTML to view code properly. 
    function escapeHTML(html) {
        return html
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function saveSnippet() {
        const title = document.getElementById('snippetTitle').value;
        const language = document.getElementById('snippetLanguage').value;
        const code = document.getElementById('snippetCode').value;

        if (title && language && code) {
            const snippet = { title, language, code };
            let snippets = JSON.parse(localStorage.getItem('snippets')) || [];
            snippets.push(snippet);
            localStorage.setItem('snippets', JSON.stringify(snippets));

            // Clear the form
            document.getElementById('snippetTitle').value = '';
            document.getElementById('snippetLanguage').value = '';
            document.getElementById('snippetCode').value = '';

            console.log('snippet: ', snippet);
            // Reload snippets
            loadSnippets();
        } else {
            alert('Please fill in all fields');
        }
    }

    function loadSnippets() {
        const snippets = JSON.parse(localStorage.getItem('snippets')) || [];
        const allSnippetsGrid = document.getElementById('allSnippetsGrid');
        const htmlSnippetsGrid = document.getElementById('htmlSnippetsGrid');
        const cssSnippetsGrid = document.getElementById('cssSnippetsGrid');
        const jsSnippetsGrid = document.getElementById('jsSnippetsGrid');
        // Clear existing content
        allSnippetsGrid.innerHTML = '';
        htmlSnippetsGrid.innerHTML = '';
        cssSnippetsGrid.innerHTML = '';
        jsSnippetsGrid.innerHTML = '';


        snippets.forEach((snippet, index) => {
            const escapedCode = escapeHTML(snippet.code);
            const snipLang = snippet.language;
            const snippetCard = `
                <div class="col-lg-4 col-md-6 col-sm-12">
                    <div class="card mt-3 snippet-card">
                        <div class="card-body">
                            <h5 class="card-title">${snippet.title}</h5>
                            <pre><code class="language-${snipLang}">${escapedCode}</code></pre>
                            <div class="snippet-icons position-absolute top-0 end-0 p-2">
                            <i class="bi bi-trash text-danger delete-snippet"data-index="${index}"></i>
                            <i class="bi bi-copy text-primary ms-3 copy-snippet" data-index="${index}"></i>
                        </div>
                        </div>
                    </div>
                </div>`;
            allSnippetsGrid.innerHTML += snippetCard;
            if (snippet.language === 'html') {
                htmlSnippetsGrid.innerHTML += snippetCard;
                htmlSnippetsGrid.classList.add('htmlCodeBlock');
            } else if (snippet.language === 'css') {
                cssSnippetsGrid.innerHTML += snippetCard;
                cssSnippetsGrid.classList.add('cssCodeBlock');
            } else if (snippet.language === 'javascript') {
                jsSnippetsGrid.innerHTML += snippetCard;
                jsSnippetsGrid.classList.add('jsCodeBlock');

            }
            // Continue for other languages


            // Add event listeners for delete and copy functionality
            document.querySelectorAll('.delete-snippet').forEach(button => {
                button.addEventListener('click', deleteSnippet);
            });
            document.querySelectorAll('.copy-snippet').forEach(button => {
                button.addEventListener('click', copySnippetToClipboard);
            });
        });

    }

    // Load snippets on page load
    document.addEventListener('DOMContentLoaded', () => {
        loadSnippets();
    });

    function deleteSnippet(event) {
        const index = event.target.getAttribute('data-index');
        let snippets = JSON.parse(localStorage.getItem('snippets')) || [];
        snippets.splice(index, 1);
        localStorage.setItem('snippets', JSON.stringify(snippets));
        loadSnippets();  // Reload the snippets to reflect changes
    }

    function copySnippetToClipboard(event) {
        const index = event.target.getAttribute('data-index');
        const snippets = JSON.parse(localStorage.getItem('snippets')) || [];
        const snippet = snippets[index].code;

        // Create a temporary textarea element to hold the snippet
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = snippet;
        document.body.appendChild(tempTextarea);

        // Select the text and copy it to clipboard
        tempTextarea.select();
        document.execCommand('copy');

        // Remove the temporary textarea
        document.body.removeChild(tempTextarea);

        alert('Snippet copied to clipboard!');
    }

    //making textarea code area more pro
    function hasLanguageClass(element) {
        return Array.from(element.classList).some(className => className.startsWith('language-'));
    }
    const codeSnippetTextEl = document.getElementById('snippetCode');
    const selectedLanguageEl = document.getElementById('snippetLanguage');

    selectedLanguageEl.addEventListener('change', function (e) {
        let selectedLang = this.value;
        const ElParent = codeSnippetTextEl.parentElement;
        console.log(ElParent);
        if (hasLanguageClass(ElParent)) {
            ElParent.classList.forEach(className => {
                if (className.startsWith('language-')) {
                    ElParent.classList.remove(className);
                    ElParent.classList.add('language-' + selectedLang)
                }
            })
        } else {
            ElParent.classList.add('language-' + selectedLang)
            console.log('no class found');
        }
    });

    // trying to figure out search myself :)
    const snippetCardEl = document.querySelector('snippet-card');
    const searchBar = document.getElementById('searchBar');
    document.addEventListener('keydown', function (e) {
        const snippets = JSON.parse(localStorage.getItem('snippets'))
        let searchTerm = searchBar.value;
        snippets.forEach((snippet, index) => {
            if (snippet.language === 'html') {
                snippetCardEl.classList.add('html');
            } else if (snippet.language === 'css') {
                snippetCardEl.classList.add('css');
            }
        });
    });
    // Initial load
    loadSnippets();
});
