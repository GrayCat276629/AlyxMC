// ============================================================
// КОНСТАНТЫ
// ============================================================
const PROJECT_TYPE = 'mod';

// ============================================================
// ЗАГРУЗКА МОДОВ
// ============================================================
async function loadMods() {
    const loader = document.getElementById('loader').value;
    const version = document.getElementById('mcVersion').value;
    const side = document.getElementById('side').value;
    const search = document.getElementById('searchInput').value;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Loading mods...</p>';

    try {
        const facets = [
            [`project_type:${PROJECT_TYPE}`]
        ];

        if (loader) {
            facets.push([`categories:${loader}`]);
        }

        if (version) {
            facets.push([`versions:${version}`]);
        }

        if (side === 'client') {
            facets.push(['client_side:required']);
        } else if (side === 'server') {
            facets.push(['server_side:required']);
        }

        let url = `https://api.modrinth.com/v2/search?facets=${encodeURIComponent(JSON.stringify(facets))}&limit=50`;
        if (search) url += `&query=${encodeURIComponent(search)}`;

        console.log('🔍 Запрос:', url);
        const response = await fetch(url);
        const data = await response.json();

        console.log('📦 Ответ:', data);
        console.log('📦 Количество модов:', data.hits ? data.hits.length : 0);

        if (data.hits && data.hits.length > 0) {
            renderMods(data.hits);
        } else {
            resultsDiv.innerHTML = '<p>No mods found. Try changing filters.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        console.error('❌ Ошибка:', error);
    }
}

// ============================================================
// ОТРИСОВКА КАРТОЧЕК
// ============================================================
function renderMods(mods) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    mods.forEach(mod => {
        const card = document.createElement('div');
        card.style.cssText = `
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 16px;
            width: 200px;
            text-align: center;
            transition: transform 0.2s;
        `;
        card.onmouseover = () => card.style.transform = 'translateY(-4px)';
        card.onmouseout = () => card.style.transform = 'translateY(0)';

        const icon = mod.icon_url || 'https://via.placeholder.com/64/333/666?text=No+Icon';
        const name = mod.title || 'Unknown';
        const description = mod.description || 'No description';
        const downloads = mod.downloads || 0;
        const url = `https://modrinth.com/mod/${mod.slug}`;

        card.innerHTML = `
            <img src="${icon}" alt="${name}" style="width: 64px; height: 64px; border-radius: 8px; background: #333; object-fit: cover;">
            <h3 style="font-size: 16px; margin: 8px 0 4px; color: white;">${name}</h3>
            <p style="font-size: 12px; color: #aaa; height: 40px; overflow: hidden; margin: 4px 0;">${description}</p>
            <span style="font-size: 12px; color: #888;">⬇️ ${downloads.toLocaleString()}</span>
            <br>
            <a href="${url}" target="_blank" style="display: inline-block; margin-top: 8px; padding: 6px 16px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; border: none;">Download</a>
        `;

        resultsDiv.appendChild(card);
    });
}

// ============================================================
// ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    loadMods();

    document.getElementById('searchBtn').addEventListener('click', loadMods);
    document.getElementById('loader').addEventListener('change', loadMods);
    document.getElementById('mcVersion').addEventListener('change', loadMods);
    document.getElementById('side').addEventListener('change', loadMods);

    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') loadMods();
    });
});