const countryInput = document.getElementById('countryInput');
const searchBtn = document.getElementById('searchBtn');
const statusEl = document.getElementById('status');
const resultsBody = document.getElementById('resultsBody');

async function searchUniversities() {
  const country = countryInput.value.trim();
  if (!country) {
    statusEl.textContent = 'Please enter a country name.';
    return;
  }

  statusEl.textContent = 'Fetching universities...';
  resultsBody.innerHTML = '';

  try {
    const res = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
    const data = await res.json();

    if (data.length === 0) {
      statusEl.textContent = `No universities found for "${country}".`;
      return;
    }

    statusEl.textContent = `Found ${data.length} universities in ${country}.`;
    data.forEach(uni => {
      const tr = document.createElement('tr');
      const website = uni.web_pages && uni.web_pages[0] ? uni.web_pages[0] : '#';
      tr.innerHTML = `
        <td>${uni.name}</td>
        <td>${uni['state-province'] || 'N/A'}</td>
        <td><a href="${website}" target="_blank" rel="noopener">${website}</a></td>
      `;
      resultsBody.appendChild(tr);
    });
  } catch (error) {
    statusEl.textContent = 'Error fetching university data. Note: Hipolabs uses HTTP, ensure mixed content is allowed or run locally.';
    console.error(error);
  }
}

searchBtn.addEventListener('click', searchUniversities);
countryInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchUniversities();
});
