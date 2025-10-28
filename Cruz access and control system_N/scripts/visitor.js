/**
 * Cruz Technologies Access Control System - Visitor Management Module
 * Handles visitor registration, check-in/check-out, and display
 */

// DOM Elements
const visitorForm = document.getElementById('visitorForm');
const visitorsTableBody = document.getElementById('visitorsTableBody');
const checkoutModal = document.getElementById('checkoutModal');
const closeModalBtn = document.querySelector('.close-modal');
const checkoutForm = document.getElementById('checkoutForm');
const currentDateElement = document.getElementById('currentDate');
const currentTimeElement = document.getElementById('currentTime');
const visitorImageInput = document.getElementById('visitorImage');
const fileNameElement = document.querySelector('.file-name');
const clearFormBtn = document.querySelector('.clear-btn');
const logoutBtn = document.getElementById('logoutBtn');

// Global variables
let currentVisitorId = null;
const visitors = []; // This would be replaced with data from API in real app

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load visitors data
    loadVisitors();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Visitor image upload
    visitorImageInput.addEventListener('change', handleImageUpload);
    
    // Visitor form submission
    visitorForm.addEventListener('submit', handleVisitorRegistration);
    
    // Clear form button
    clearFormBtn.addEventListener('click', resetVisitorForm);
    
    // Checkout modal
    closeModalBtn.addEventListener('click', () => checkoutModal.style.display = 'none');
    document.querySelector('.cancel-btn').addEventListener('click', () => checkoutModal.style.display = 'none');
    
    // Checkout form submission
    checkoutForm.addEventListener('submit', handleCheckout);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
}

/**
 * Updates the current date and time display
 */
function updateDateTime() {
    const now = new Date();
    currentDateElement.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    currentTimeElement.textContent = now.toLocaleTimeString('en-US');
}

/**
 * Handles visitor image upload
 */
function handleImageUpload() {
    if (visitorImageInput.files.length > 0) {
        fileNameElement.textContent = visitorImageInput.files[0].name;
    } else {
        fileNameElement.textContent = 'No image selected';
    }
}

/**
 * Handles visitor registration form submission
 * @param {Event} e 
 */
async function handleVisitorRegistration(e) {
    e.preventDefault();
    
    // Get form values
    const visitorName = document.getElementById('visitorName').value;
    const visitorNIN = document.getElementById('visitorNIN').value;
    const host = document.getElementById('host').value;
    const purpose = document.getElementById('purpose').value;
    const checkInTime = new Date();
    
    // Validate form
    if (!visitorName || !visitorNIN || !host || !purpose) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Prepare visitor data
    const visitorData = {
        name: visitorName,
        nin: visitorNIN,
        host: host,
        purpose: purpose,
        checkInTime: checkInTime.toISOString(),
        image: null, // In a real app, this would be the uploaded image
        status: 'checked-in'
    };
    
    // Show loading state
    const submitBtn = visitorForm.querySelector('.submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // API Call to register visitor
        const response = await registerVisitor(visitorData);
        
        if (response.success) {
            // Add visitor to local array (in a real app, this would come from the API)
            visitors.unshift(response.visitor);
            
            // Update the table
            renderVisitorsTable();
            
            // Reset the form
            resetVisitorForm();
            
            // Show success message
            alert('Visitor registered successfully!');
        } else {
            alert('Failed to register visitor: ' + (response.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred while registering visitor');
    } finally {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Register Visitor';
        submitBtn.disabled = false;
    }
}

/**
 * Resets the visitor registration form
 */
function resetVisitorForm() {
    visitorForm.reset();
    fileNameElement.textContent = 'No image selected';
}

/**
 * Loads visitors data from API
 */
async function loadVisitors() {
    try {
        // Show loading state
        visitorsTableBody.innerHTML = '<tr><td colspan="8" class="loading">Loading visitors...</td></tr>';
        
        // API Call to get visitors
        const response = await getVisitors();
        
        if (response.success) {
            // In a real app, we would use the visitors from the response
            // visitors = response.visitors;
            
            // For demo purposes, we'll use mock data
            generateMockVisitors();
            
            // Render the table
            renderVisitorsTable();
        } else {
            visitorsTableBody.innerHTML = '<tr><td colspan="8" class="error">Failed to load visitors</td></tr>';
        }
    } catch (error) {
        console.error('Error loading visitors:', error);
        visitorsTableBody.innerHTML = '<tr><td colspan="8" class="error">Error loading visitors</td></tr>';
    }
}

/**
 * Renders visitors data in the table
 */
function renderVisitorsTable() {
    if (visitors.length === 0) {
        visitorsTableBody.innerHTML = '<tr><td colspan="8" class="no-data">No visitors found</td></tr>';
        return;
    }
    
    let tableHTML = '';
    
    visitors.forEach(visitor => {
        const checkInTime = new Date(visitor.checkInTime);
        const checkOutTime = visitor.checkOutTime ? new Date(visitor.checkOutTime) : null;
        
        tableHTML += `
            <tr>
                <td>
                    <div class="visitor-photo">
                        ${visitor.image ? 
                            `<img src="${visitor.image}" alt="${visitor.name}">` : 
                            `<i class="fas fa-user"></i>`}
                    </div>
                </td>
                <td>${visitor.name}</td>
                <td>${visitor.nin}</td>
                <td>${getHostName(visitor.host)}</td>
                <td>${checkInTime.toLocaleTimeString()}</td>
                <td>${checkOutTime ? checkOutTime.toLocaleTimeString() : '--'}</td>
                <td>
                    <span class="status-badge status-${visitor.status.replace(' ', '-')}">
                        ${visitor.status}
                    </span>
                </td>
                <td>
                    ${visitor.status === 'checked-in' ? 
                        `<button class="action-btn checkout-btn" data-id="${visitor.id}">
                            <i class="fas fa-sign-out-alt" title="Check-out"></i>
                        </button>` : ''}
                    <button class="action-btn view-btn" data-id="${visitor.id}">
                        <i class="fas fa-eye" title="View Details"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    visitorsTableBody.innerHTML = tableHTML;
    
    // Add event listeners to action buttons
    document.querySelectorAll('.checkout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => openCheckoutModal(e.target.closest('.checkout-btn').dataset.id));
    });
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => viewVisitorDetails(e.target.closest('.view-btn').dataset.id));
    });
}

/**
 * Opens the checkout modal for a visitor
 * @param {string} visitorId 
 */
function openCheckoutModal(visitorId) {
    const visitor = visitors.find(v => v.id === visitorId);
    
    if (!visitor) return;
    
    currentVisitorId = visitorId;
    
    // Set modal content
    document.getElementById('modalVisitorName').textContent = visitor.name;
    document.getElementById('modalVisitorNIN').textContent = visitor.nin;
    document.getElementById('modalVisitorHost').textContent = getHostName(visitor.host);
    document.getElementById('modalCheckInTime').textContent = new Date(visitor.checkInTime).toLocaleString();
    
    const photoElement = document.getElementById('modalVisitorPhoto');
    if (visitor.image) {
        photoElement.src = visitor.image;
        photoElement.style.display = 'block';
    } else {
        photoElement.style.display = 'none';
    }
    
    // Show modal
    checkoutModal.style.display = 'flex';
}

/**
 * Handles visitor checkout
 * @param {Event} e 
 */
async function handleCheckout(e) {
    e.preventDefault();
    
    const notes = document.getElementById('checkoutNotes').value;
    
    try {
        // Show loading state
        const confirmBtn = checkoutForm.querySelector('.confirm-btn');
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        confirmBtn.disabled = true;
        
        // API Call to check out visitor
        const response = await checkoutVisitor(currentVisitorId, notes);
        
        if (response.success) {
            // Update visitor status in local array
            const visitorIndex = visitors.findIndex(v => v.id === currentVisitorId);
            if (visitorIndex !== -1) {
                visitors[visitorIndex].status = 'checked-out';
                visitors[visitorIndex].checkOutTime = new Date().toISOString();
            }
            
            // Update the table
            renderVisitorsTable();
            
            // Close modal and reset form
            checkoutModal.style.display = 'none';
            checkoutForm.reset();
            
            // Show success message
            alert('Visitor checked out successfully!');
        } else {
            alert('Failed to check out visitor: ' + (response.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('An error occurred while checking out visitor');
    } finally {
        const confirmBtn = checkoutForm.querySelector('.confirm-btn');
        confirmBtn.innerHTML = 'Confirm Check-out';
        confirmBtn.disabled = false;
    }
}

/**
 * Views visitor details
 * @param {string} visitorId 
 */
function viewVisitorDetails(visitorId) {
    // In a real app, this would open a detailed view or modal
    const visitor = visitors.find(v => v.id === visitorId);
    alert(`Visitor Details:\n\nName: ${visitor.name}\nNIN: ${visitor.nin}\nHost: ${getHostName(visitor.host)}\nPurpose: ${visitor.purpose}\nCheck-in: ${new Date(visitor.checkInTime).toLocaleString()}\nCheck-out: ${visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : 'Not checked out'}`);
}

/**
 * Handles user logout
 */
function handleLogout() {
    // In a real app, this would call the logout API
    localStorage.removeItem('auth_token');
    window.location.href = 'index.html';
}

/**
 * Gets host name from host ID
 * @param {string} hostId 
 * @returns {string}
 */
function getHostName(hostId) {
    const hosts = {
        'john.doe': 'John Doe (IT)',
        'jane.smith': 'Jane Smith (HR)',
        'michael.johnson': 'Michael Johnson (Finance)',
        'sarah.williams': 'Sarah Williams (Operations)'
    };
    
    return hosts[hostId] || hostId;
}

/**
 * Generates mock visitors data for demo purposes
 */
function generateMockVisitors() {
    const mockPurposes = ['Meeting', 'Delivery', 'Interview', 'Maintenance', 'Other'];
    const mockHosts = ['john.doe', 'jane.smith', 'michael.johnson', 'sarah.williams'];
    
    // Clear existing visitors
    visitors.length = 0;
    
    // Generate 10 mock visitors
    for (let i = 1; i <= 10; i++) {
        const checkInTime = new Date();
        checkInTime.setHours(checkInTime.getHours() - Math.floor(Math.random() * 24));
        checkInTime.setMinutes(checkInTime.getMinutes() - Math.floor(Math.random() * 60));
        
        const isCheckedOut = Math.random() > 0.3;
        let checkOutTime = null;
        
        if (isCheckedOut) {
            checkOutTime = new Date(checkInTime);
            checkOutTime.setHours(checkInTime.getHours() + Math.floor(Math.random() * 4) + 1);
        }
        
        visitors.push({
            id: 'visitor-' + i,
            name: `Visitor ${i}`,
            nin: `1234567890${i}`,
            host: mockHosts[Math.floor(Math.random() * mockHosts.length)],
            purpose: mockPurposes[Math.floor(Math.random() * mockPurposes.length)],
            checkInTime: checkInTime.toISOString(),
            checkOutTime: isCheckedOut ? checkOutTime.toISOString() : null,
            status: isCheckedOut ? 'checked-out' : 'checked-in',
            image: null
        });
    }
    
    // Sort by check-in time (newest first)
    visitors.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
}

/* API Functions (would be replaced with actual fetch calls in production) */

/**
 * Registers a new visitor
 * @param {object} visitorData 
 * @returns {Promise<object>}
 */
async function registerVisitor(visitorData) {
    // Mock API call
    return new Promise(resolve => {
        setTimeout(() => {
            const newVisitor = {
                ...visitorData,
                id: 'visitor-' + (visitors.length + 1)
            };
            resolve({ success: true, visitor: newVisitor });
        }, 1000);
    });
}

/**
 * Gets all visitors
 * @returns {Promise<object>}
 */
async function getVisitors() {
    // Mock API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true });
        }, 800);
    });
}

/**
 * Checks out a visitor
 * @param {string} visitorId 
 * @param {string} notes 
 * @returns {Promise<object>}
 */
async function checkoutVisitor(visitorId, notes) {
    // Mock API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ 
                success: true,
                message: 'Visitor checked out successfully',
                checkOutTime: new Date().toISOString()
            });
        }, 800);
    });
}