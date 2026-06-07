// -- STATE MANAGEMENT --
let students = JSON.parse(localStorage.getItem('portal_students')) || [];
const ADMIN_PASSWORD = "admin123"; // Prototype password

// -- DOM ELEMENTS --
const form = document.getElementById('student-form');
const viewRegister = document.getElementById('view-register');
const viewDirectory = document.getElementById('view-directory');
const tabRegister = document.getElementById('tab-register');
const tabDirectory = document.getElementById('tab-directory');

// Modal Elements
const adminModal = document.getElementById('admin-modal');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const successOverlay = document.getElementById('success-overlay');

// Live ID Card Preview Elements
const prevName = document.getElementById('preview-name');
const prevContact = document.getElementById('preview-contact');
const prevPhone = document.getElementById('preview-phone');
const prevGenderVal = document.getElementById('preview-gender-val');
const prevQualVal = document.getElementById('preview-qual-val');
const badgeDest = document.getElementById('badge-dest');
const badgeScore = document.getElementById('badge-score');
const prevHobbies = document.getElementById('preview-hobbies');
const prevAvatar = document.getElementById('preview-avatar');
const prevId = document.getElementById('preview-id');

// -- NAVIGATION & AUTH LOGIC --
function switchTab(tab) {
    if (tab === 'register') {
        viewRegister.classList.remove('hidden');
        viewDirectory.classList.add('hidden');

        tabRegister.classList.replace('text-slate-400', 'text-white');
        tabRegister.classList.replace('bg-transparent', 'bg-white/10');

        tabDirectory.classList.replace('text-white', 'text-slate-400');
        tabDirectory.classList.replace('bg-white/10', 'bg-transparent');
    } else if (tab === 'directory') {
        viewRegister.classList.add('hidden');
        viewDirectory.classList.remove('hidden');

        tabDirectory.classList.replace('text-slate-400', 'text-white');
        tabDirectory.classList.replace('bg-transparent', 'bg-white/10');

        tabRegister.classList.replace('text-white', 'text-slate-400');
        tabRegister.classList.replace('bg-white/10', 'bg-transparent');

        updateDirectoryView();
    }
}

function openAdminLogin() {
    if (viewDirectory.classList.contains('hidden')) {
        adminModal.classList.remove('hidden');
        document.getElementById('admin-password').focus();
    }
}

function closeAdminLogin() {
    adminModal.classList.add('hidden');
    document.getElementById('admin-password').value = '';
    loginError.classList.add('hidden');
}

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_PASSWORD) {
        closeAdminLogin();
        switchTab('directory');
    } else {
        loginError.classList.remove('hidden');
    }
});

// -- LIVE PREVIEW LOGIC --
function updatePreview() {
    const nameVal = document.getElementById('name').value || 'Your Name';
    const contactVal = document.getElementById('contact').value || 'email@example.com';
    const phoneVal = document.getElementById('phone').value || '+1 (555) 000-0000';
    const genderVal = document.getElementById('gender').value || '--';
    const qualVal = document.getElementById('qualification').value || '--';
    const examVal = document.getElementById('exam-type').value;
    const scoreVal = document.getElementById('target-score').value;
    const destVal = document.getElementById('destination').value;
    const hobbiesVal = document.getElementById('hobbies').value;

    // Direct text mappings
    prevName.innerText = nameVal;
    prevContact.innerText = contactVal;
    prevPhone.innerText = phoneVal;
    prevGenderVal.innerText = genderVal;
    prevQualVal.innerText = qualVal;

    // Dynamic Avatar generation based on name entry
    const safeSeed = encodeURIComponent(nameVal);
    prevAvatar.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${safeSeed}&backgroundColor=transparent`;

    // Destination Pill Badge configuration
    if (destVal) {
        badgeDest.innerText = `Target: ${destVal}`;
        badgeDest.className = 'bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] px-2 py-0.5 rounded-full font-medium';
    } else {
        badgeDest.innerText = 'No Target Country';
        badgeDest.className = 'bg-white/5 text-slate-400 border border-white/5 text-[9px] px-2 py-0.5 rounded-full font-medium';
    }

    // Score / Exam Pill Badge configuration
    if (examVal && examVal !== 'None') {
        badgeScore.innerText = `${examVal}: ${scoreVal || 'TBD'}`;
        badgeScore.className = 'bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] px-2 py-0.5 rounded-full font-medium';
    } else if (examVal === 'None') {
        badgeScore.innerText = 'No Exam Needed';
        badgeScore.className = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded-full font-medium';
    } else {
        badgeScore.innerText = 'Exam: --';
        badgeScore.className = 'bg-white/5 text-slate-400 border border-white/5 text-[9px] px-2 py-0.5 rounded-full font-medium';
    }

    // Comma-separated Hobby Tag Builder
    prevHobbies.innerHTML = '';
    if (!hobbiesVal) {
        prevHobbies.innerHTML = '<span class="bg-white/5 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-white/5">Waiting for input...</span>';
        return;
    }

    const tags = hobbiesVal.split(',').map(t => t.trim()).filter(t => t);
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'bg-cyan-500/10 text-cyan-300 text-[10px] font-medium px-2 py-0.5 rounded border border-cyan-500/20';
        span.innerText = tag;
        prevHobbies.appendChild(span);
    });
}

// -- FORM SUBMISSION LOGIC --
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const generatedId = 'ID-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Creating data payload mapping all 10 custom requirements
    const newStudent = {
        id: generatedId,
        name: document.getElementById('name').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        gender: document.getElementById('gender').value,
        qualification: document.getElementById('qualification').value.trim(),
        examType: document.getElementById('exam-type').value,
        targetScore: document.getElementById('target-score').value.trim() || 'N/A',
        destination: document.getElementById('destination').value,
        hobbies: document.getElementById('hobbies').value.trim(),
        description: document.getElementById('description').value.trim() || 'No description listed.',
        dateAdded: new Date().toLocaleDateString()
    };

    students.push(newStudent);
    localStorage.setItem('portal_students', JSON.stringify(students));

    prevId.innerText = generatedId;
    successOverlay.classList.remove('hidden');

    // Smooth-scroll alignment view optimization on smaller screen monitors
    if (window.innerWidth < 1024) {
        document.getElementById('id-card-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

function resetRegistration() {
    form.reset();
    successOverlay.classList.add('hidden');
    prevId.innerText = '#ID-PENDING';
    updatePreview();
}

// -- DIRECTORY RENDERING LOGIC --
function updateDirectoryView() {
    const grid = document.getElementById('directory-grid');
    const emptyState = document.getElementById('empty-state');
    document.getElementById('total-students').innerText = students.length;

    if (students.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    grid.innerHTML = '';

    students.forEach(student => {
        const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(student.name)}&backgroundColor=transparent`;

        const hobbyHtml = student.hobbies.split(',')
            .map(h => h.trim()).filter(h => h)
            .map(h => `<span class="bg-cyan-500/10 text-cyan-300 text-[10px] font-medium px-2 py-0.5 rounded border border-cyan-500/20">${h}</span>`)
            .join('');

        // Clean conditional badge output configurations inside the grid items
        const scoreBadgeHtml = student.examType !== 'None' 
            ? `<span class="bg-purple-500/10 text-purple-300 text-[10px] px-2 py-0.5 rounded border border-purple-500/20 font-medium">${student.examType}: ${student.targetScore}</span>`
            : `<span class="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-white/5 font-medium">No Exam</span>`;

        const cardHTML = `
            <div class="glass-panel p-5 sm:p-6 rounded-3xl card-hover relative overflow-hidden group flex flex-col justify-between min-h-[340px]">
                <div class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-cyan-500/10"></div>
                
                <div>
                    <div class="flex items-start justify-between mb-4 relative z-10">
                        <span class="text-[10px] font-mono text-slate-500 bg-black/30 px-2 py-1 rounded">${student.id}</span>
                        <span class="text-[10px] text-slate-500">${student.dateAdded}</span>
                    </div>
                    
                    <div class="flex items-center gap-3 mb-4 relative z-10">
                        <img src="${avatarUrl}" alt="Avatar" class="w-12 h-12 rounded-full bg-black/20 border border-white/10 p-0.5 object-contain flex-shrink-0">
                        <div class="min-w-0">
                            <h4 class="text-base font-bold text-white leading-tight truncate">${student.name}</h4>
                            <p class="text-xs text-cyan-400 mt-0.5 truncate">${student.contact}</p>
                            <p class="text-[11px] text-slate-400">${student.phone}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-black/10 p-2.5 rounded-xl border border-white/5 mb-4">
                        <div><span class="text-slate-500 block text-[9px] uppercase font-semibold">Gender</span>${student.gender}</div>
                        <div><span class="text-slate-500 block text-[9px] uppercase font-semibold">Destination</span><span class="text-blue-300 font-medium">${student.destination}</span></div>
                        <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase font-semibold">Education Qualification</span><span class="truncate block">${student.qualification}</span></div>
                    </div>

                    <div class="mb-4 text-xs text-slate-400 line-clamp-2 bg-slate-900/40 p-2 rounded-lg italic border-l-2 border-cyan-500/30">
                        "${student.description}"
                    </div>
                </div>

                <div class="pt-3 border-t border-white/5 relative z-10 mt-auto">
                    <div class="flex justify-between items-center gap-2 mb-2">
                        <p class="text-[9px] uppercase text-slate-500 font-semibold tracking-wider">Interests</p>
                        ${scoreBadgeHtml}
                    </div>
                    <div class="flex flex-wrap gap-1 max-h-[48px] overflow-hidden pr-6">
                        ${hobbyHtml || '<span class="text-[11px] text-slate-600">None listed</span>'}
                    </div>
                    
                    <button onclick="deleteStudent('${student.id}')" class="absolute bottom-0 right-0 text-slate-600 hover:text-red-400 transition-colors z-20 p-1" title="Delete Profile">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

window.deleteStudent = function (id) {
    if (confirm("Remove this student from the directory?")) {
        students = students.filter(s => s.id !== id);
        localStorage.setItem('portal_students', JSON.stringify(students));
        updateDirectoryView();
    }
};