document.addEventListener('DOMContentLoaded', function() {
  // Get all profile avatars (both in sidebar and top nav)
  const profileAvatars = document.querySelectorAll('.profile-avatar');
  const sidebarProfile = document.querySelector('.profile-container .profile');
  const topNavProfile = document.querySelector('.top-nav-actions .profile');

  const nameEl = document.getElementById('profile-name');
  const roleEl = document.getElementById('profile-role');
  const avatarSidebar = document.getElementById('profile-avatar');
  const avatarMobile = document.getElementById('profile-avatar-mobile');

  if (!nameEl || !roleEl || !avatarSidebar || !avatarMobile) {
    console.error('One or more profile elements are missing in the DOM!');
    return;
  }

  const email = localStorage.getItem('userEmail');
  if (!email) {
    nameEl.textContent = 'No email found';
    avatarSidebar.textContent = '--';
    avatarMobile.textContent = '--';
    return;
  }

  fetch(`http://localhost:3000/user/${email}`)
    .then(response => response.json())
    .then(data => {
      const user = data.userDetails;
      console.log(user);
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
      const plan = user.plan || 'Free';

      nameEl.textContent = fullName;
      roleEl.textContent = plan;
      avatarSidebar.textContent = initials.toUpperCase() || '--';
      avatarMobile.textContent = initials.toUpperCase() || '--';
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      nameEl.textContent = 'Unavailable';
      roleEl.textContent = 'Try again later';
      avatarSidebar.textContent = '--';
      avatarMobile.textContent = '--';
    });

  // Create dropdown menu if it doesn't exist
  function createDropdownMenu() {
    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';
    dropdown.innerHTML = `
      <a href="#profile" class="dropdown-item">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        My Profile
      </a>
      <a href="#subscription" class="dropdown-item">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        My Subscription
      </a>
      <a href="#help" class="dropdown-item">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Help
      </a>
      <div class="dropdown-divider"></div>
      <a href="#logout" class="dropdown-item">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        Logout
      </a>
    `;
    return dropdown;
  }

  // Add click event listeners to profile avatars
  profileAvatars.forEach(avatar => {
    avatar.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Remove any existing dropdowns
      const existingDropdown = document.querySelector('.profile-dropdown');
      if (existingDropdown) {
        existingDropdown.remove();
      }

      // Create and position new dropdown
      const dropdown = createDropdownMenu();
      const profile = this.closest('.profile');
      profile.appendChild(dropdown);

      // Show dropdown
      setTimeout(() => dropdown.classList.add('show'), 0);
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    const dropdown = document.querySelector('.profile-dropdown');
    if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.profile-avatar')) {
      dropdown.remove();
    }
  });

  // Handle dropdown menu items
  document.addEventListener('click', function(e) {
    if (e.target.closest('.dropdown-item')) {
      e.preventDefault();
      const action = e.target.closest('.dropdown-item').getAttribute('href').substring(1);
      
      switch(action) {
        case 'profile':
          // Get user email from localStorage
          const email = localStorage.getItem('userEmail');
          if (!email) {
            alert('Please log in to view your profile');
            return;
          }

          // Fetch user data
          fetch(`http://localhost:3000/user/${email}`)
            .then(async (response) => {
              const data = await response.json();
              //console.log("User data:", data);
              
              // Remove any existing modal
              const oldModal = document.querySelector('.profile-modal');
              if (oldModal) oldModal.remove();

              // Create and show profile modal
              const modal = document.createElement('div');
              modal.className = 'profile-modal show'; // add show immediately

              const user = data.userDetails;
              console.log(user);
              const firstName = `${user.firstName || ''}`.trim();
              const lastName = `${user.lastName || ''}`.trim();
              const email = `${user.email || ''}`.trim();
              const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
              const plan = user.plan || 'Free';

              modal.innerHTML = `
                <div class="profile-modal-content">
                  <h2>My Profile</h2>
                  <div class="profile-details">
                    <p><strong>First Name:</strong> ${firstName}</p>
                    <p><strong>Last Name:</strong> ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Plan:</strong> ${plan}</p>
                  </div>
                  <button class="close-modal">Close</button>
                </div>
              `;
              document.body.appendChild(modal);

              // Close modal on click
              modal.addEventListener('click', function(e) {
                if (e.target === modal || e.target.classList.contains('close-modal')) {
                  modal.remove();
                }
              });
            })
            .catch((error) => {
              console.error("Error:", error);
              alert('Failed to fetch profile data: ' + error.message);
            });
          break;

        case 'subscription':
          const emailForSub = localStorage.getItem('userEmail');
          if (!emailForSub) {
            alert('Please log in to view your subscription');
            return;
          }
          fetch(`http://localhost:3000/user/${emailForSub}`)
            .then(response => response.json())
            .then(data => {
              const user = data.userDetails || {};
              const plan = user.plan || 'Free';

              const subscriptionModal = document.createElement('div');
              subscriptionModal.className = 'profile-modal show';
              subscriptionModal.innerHTML = `
                <div class="profile-modal-content">
                  <h2>My Subscription</h2>
                  <div class="profile-details">
                    <p><strong>Current Plan:</strong> ${plan}</p>
                  </div>
                  <button class="close-modal">Close</button>
                </div>
              `;
              document.body.appendChild(subscriptionModal);

              // Close modal on click
              subscriptionModal.addEventListener('click', function(e) {
                if (e.target === subscriptionModal || e.target.classList.contains('close-modal')) {
                  subscriptionModal.remove();
                }
              });
            })
            .catch((error) => {
              console.error("Error:", error);
              alert('Failed to fetch subscription data: ' + error.message);
            });
          break;

        case 'help':
          const helpModal = document.createElement('div');
          helpModal.className = 'profile-modal';
          helpModal.innerHTML = `
            <div class="profile-modal-content">
              <h2>Help Center</h2>
              <div class="profile-details">
                <p>Help content will be added here.</p>
              </div>
              <button class="close-modal">Close</button>
            </div>
          `;
          document.body.appendChild(helpModal);
          setTimeout(() => helpModal.classList.add('show'), 0);

          helpModal.addEventListener('click', function(e) {
            if (e.target === helpModal || e.target.classList.contains('close-modal')) {
              helpModal.classList.remove('show');
              setTimeout(() => helpModal.remove(), 300);
            }
          });
          break;

        case 'logout':
          localStorage.clear();
          window.location.href = 'index.html';
          break;
      }

      // Remove dropdown after action
      const dropdown = document.querySelector('.profile-dropdown');
      if (dropdown) {
        dropdown.remove();
      }
    }
  });
}); 