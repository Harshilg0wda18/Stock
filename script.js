// Wait for DOM to be fully loaded before initializing charts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts when the page loads
    initCharts();
  
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebarClose = document.querySelector('.sidebar-close');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('show');
      });
    }

    if (sidebarClose && sidebar) {
      sidebarClose.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.remove('show');
      });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
      if (
        sidebar &&
        sidebar.classList.contains('show') &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        sidebar.classList.remove('show');
      }
    });
    
    // Profile dropdown functionality
    setupProfileDropdown();
  });
  
  // Function to set up profile dropdown behavior
  function setupProfileDropdown() {
    const profileAvatars = document.querySelectorAll('.profile-avatar');
    
    // Create dropdown menu if it doesn't exist
    if (!document.querySelector('.profile-dropdown')) {
      const dropdown = document.createElement('div');
      dropdown.className = 'profile-dropdown';
      dropdown.innerHTML = `
        <a href="#" class="dropdown-item">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          My Profile
        </a>
        <a href="#" class="dropdown-item">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
          My Subscription
        </a>
        <a href="#" class="dropdown-item">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Help
        </a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item">
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </a>
      `;
      
      // Add dropdown to top nav actions
      const topNavActions = document.querySelector('.top-nav-actions');
      if (topNavActions) {
        topNavActions.appendChild(dropdown);
      }
    }
    
    const dropdown = document.querySelector('.profile-dropdown');
    
    // Add click event to profile avatars
    profileAvatars.forEach(avatar => {
      avatar.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown.classList.toggle('show');
      });
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(event) {
      if (dropdown && !dropdown.contains(event.target) && !event.target.classList.contains('profile-avatar')) {
        dropdown.classList.remove('show');
      }
    });
  }
  
  // Function to initialize all charts
  function initCharts() {
    // Initialize chart objects
    const charts = {};
    
    // Initialize Revenue Chart
    const revenueChartCtx = document.getElementById('revenueChart');
    if (revenueChartCtx) {
      charts.revenue = new Chart(revenueChartCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue',
            backgroundColor: 'rgba(0, 105, 196, 0.2)',
            borderColor: '#0069c4',
            data: [4500, 5500, 6000, 5700, 6800, 7200],
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
    
    // Initialize Traffic Chart (Doughnut)
    const trafficChartCtx = document.getElementById('trafficChart');
    if (trafficChartCtx) {
      charts.traffic = new Chart(trafficChartCtx, {
        type: 'doughnut',
        data: {
          labels: ['Direct', 'Organic Search', 'Referral', 'Social Media'],
          datasets: [{
            data: [35, 30, 20, 15],
            backgroundColor: ['#0069c4', '#00a9e0', '#33d6ff', '#99e9ff'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%'
        }
      });
    }
    
    // Initialize Sales Chart (Bar)
    const salesChartCtx = document.getElementById('salesChart');
    if (salesChartCtx) {
      charts.sales = new Chart(salesChartCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Online Sales',
              backgroundColor: '#0069c4',
              data: [1800, 2100, 1950, 2300, 2150, 2450]
            },
            {
              label: 'Store Sales',
              backgroundColor: '#33d6ff',
              data: [1200, 1300, 1150, 1250, 1350, 1500]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
    
    // Initialize Demographics Chart (Pie)
    const demographicsChartCtx = document.getElementById('demographicsChart');
    if (demographicsChartCtx) {
      charts.demographics = new Chart(demographicsChartCtx, {
        type: 'pie',
        data: {
          labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
          datasets: [{
            data: [15, 30, 25, 18, 12],
            backgroundColor: ['#0069c4', '#0086e0', '#00a9e0', '#33d6ff', '#99e9ff'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
    
    // Return charts object in case we need to access them later
    return charts;
  }
  
  // Add event listeners for chart period selectors
  const periodSelectors = document.querySelectorAll('.chart-period-selector');
  periodSelectors.forEach(selector => {
    selector.addEventListener('change', function() {
      // In a real application, this would make an API call 
      // to fetch new data based on selected period
      console.log('Period changed to:', this.value);
    });
  });
  
  // Handle window resize to ensure charts are responsive
  window.addEventListener('resize', function() {
    // Use a throttling mechanism to prevent too many redraws
    let resizeTimer;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Log the resize event for debugging
      console.log('Window resized, charts would be redrawn');
      
      // For better responsiveness, we might want to destroy and recreate charts
      // on significant layout changes, but for now we'll just rely on Chart.js responsive option
    }, 250);
  });