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

        // Preview Elements
        const prevName = document.getElementById('preview-name');
        const prevContact = document.getElementById('preview-contact');
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
            const hobbiesVal = document.getElementById('hobbies').value;

            prevName.innerText = nameVal;
            prevContact.innerText = contactVal;

            const safeSeed = encodeURIComponent(nameVal);
            prevAvatar.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${safeSeed}&backgroundColor=transparent`;

            prevHobbies.innerHTML = '';
            if (!hobbiesVal) {
                prevHobbies.innerHTML = '<span class="bg-white/10 text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/5">Waiting for input...</span>';
                return;
            }

            const tags = hobbiesVal.split(',').map(t => t.trim()).filter(t => t);
            tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'bg-cyan-500/10 text-cyan-300 text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-cyan-500/20';
                span.innerText = tag;
                prevHobbies.appendChild(span);
            });
        }

        // -- FORM SUBMISSION LOGIC --
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const generatedId = 'ID-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

            const newStudent = {
                id: generatedId,
                name: document.getElementById('name').value.trim(),
                contact: document.getElementById('contact').value.trim(),
                hobbies: document.getElementById('hobbies').value.trim(),
                dateAdded: new Date().toLocaleDateString()
            };

            students.push(newStudent);
            localStorage.setItem('portal_students', JSON.stringify(students));

            prevId.innerText = generatedId;
            successOverlay.classList.remove('hidden');

            // Scroll to top on mobile so they can see the ID card clearly
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
                    .map(h => `<span class="bg-cyan-500/10 text-cyan-300 text-[10px] font-medium px-2 py-1 rounded border border-cyan-500/20">${h}</span>`)
                    .join('');

                const cardHTML = `
                    <div class="glass-panel p-5 sm:p-6 rounded-3xl card-hover relative overflow-hidden group">
                        <div class="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-cyan-500/20"></div>
                        
                        <div class="flex items-start justify-between mb-4 relative z-10">
                            <span class="text-[10px] font-mono text-slate-500 bg-black/30 px-2 py-1 rounded">${student.id}</span>
                            <span class="text-[10px] text-slate-500">${student.dateAdded}</span>
                        </div>
                        
                        <div class="flex items-center gap-3 sm:gap-4 mb-5 relative z-10">
                            <img src="${avatarUrl}" alt="Avatar" class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/20 border-2 border-white/10 p-1 object-contain flex-shrink-0">
                            <div class="min-w-0">
                                <h4 class="text-base sm:text-lg font-bold text-white leading-tight truncate">${student.name}</h4>
                                <p class="text-xs sm:text-sm text-cyan-400 mt-1 truncate">${student.contact}</p>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-white/5 relative z-10">
                            <p class="text-[10px] uppercase text-slate-500 mb-2 font-semibold tracking-wider">Hobbies</p>
                            <div class="flex flex-wrap gap-1.5">
                                ${hobbyHtml || '<span class="text-xs text-slate-600">None listed</span>'}
                            </div>
                        </div>
                        
                        <button onclick="deleteStudent('${student.id}')" class="absolute bottom-4 right-4 text-slate-600 hover:text-red-400 transition-colors z-20 p-2 sm:p-0">
                            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
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