import { backend } from 'declarations/backend';

let currentPath = '/';

async function updateDirectoryStructure() {
    showLoading();
    try {
        const directory = await backend.listDirectory(currentPath);
        if (directory) {
            const structureElement = document.getElementById('directory-structure');
            structureElement.innerHTML = '';

            const filesList = document.createElement('ul');
            filesList.className = 'list-group';
            directory.files.forEach(file => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `📄 ${file}`;
                li.onclick = () => viewFile(`${currentPath}/${file}`);
                filesList.appendChild(li);
            });

            const dirList = document.createElement('ul');
            dirList.className = 'list-group';
            directory.subdirectories.forEach(dir => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = `📁 ${dir}`;
                li.onclick = () => navigateToDirectory(dir);
                dirList.appendChild(li);
            });

            structureElement.appendChild(filesList);
            structureElement.appendChild(dirList);
        }
    } catch (error) {
        console.error('Error updating directory structure:', error);
    } finally {
        hideLoading();
    }
}

function navigateToDirectory(dirName) {
    currentPath = currentPath === '/' ? `/${dirName}` : `${currentPath}/${dirName}`;
    document.getElementById('current-path').textContent = currentPath;
    updateDirectoryStructure();
}

document.getElementById('go-up').addEventListener('click', () => {
    if (currentPath !== '/') {
        currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        if (currentPath === '') currentPath = '/';
        document.getElementById('current-path').textContent = currentPath;
        updateDirectoryStructure();
    }
});

document.getElementById('create-file').addEventListener('click', async () => {
    const fileName = document.getElementById('file-name').value;
    const fileContent = document.getElementById('file-content').value;
    if (fileName && fileContent) {
        showLoading();
        try {
            const result = await backend.createFile(currentPath, fileName, fileContent);
            if (result) {
                updateDirectoryStructure();
                document.getElementById('file-name').value = '';
                document.getElementById('file-content').value = '';
            } else {
                alert('Failed to create file');
            }
        } catch (error) {
            console.error('Error creating file:', error);
            alert('Error creating file');
        } finally {
            hideLoading();
        }
    }
});

document.getElementById('create-dir').addEventListener('click', async () => {
    const dirName = document.getElementById('dir-name').value;
    if (dirName) {
        showLoading();
        try {
            const result = await backend.createDirectory(currentPath, dirName);
            if (result) {
                updateDirectoryStructure();
                document.getElementById('dir-name').value = '';
            } else {
                alert('Failed to create directory');
            }
        } catch (error) {
            console.error('Error creating directory:', error);
            alert('Error creating directory');
        } finally {
            hideLoading();
        }
    }
});

async function viewFile(filePath) {
    showLoading();
    try {
        const content = await backend.readFile(filePath);
        if (content) {
            document.getElementById('file-viewer-name').textContent = filePath.split('/').pop();
            document.getElementById('file-viewer-content').value = content;
            document.getElementById('file-viewer').style.display = 'block';
            document.getElementById('update-file').onclick = () => updateFile(filePath);
        } else {
            alert('File not found');
        }
    } catch (error) {
        console.error('Error viewing file:', error);
        alert('Error viewing file');
    } finally {
        hideLoading();
    }
}

async function updateFile(filePath) {
    const newContent = document.getElementById('file-viewer-content').value;
    showLoading();
    try {
        const result = await backend.updateFile(filePath, newContent);
        if (result) {
            alert('File updated successfully');
        } else {
            alert('Failed to update file');
        }
    } catch (error) {
        console.error('Error updating file:', error);
        alert('Error updating file');
    } finally {
        hideLoading();
    }
}

document.getElementById('close-viewer').addEventListener('click', () => {
    document.getElementById('file-viewer').style.display = 'none';
});

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

updateDirectoryStructure();
