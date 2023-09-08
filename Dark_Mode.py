import subprocess

# Function to append index.html content to a template file
def append_index_html():
    # Read the content of the template2.html file
    with open('template2.html', 'r') as template_file:
        template_content = template_file.read()

    # Read the content of the index.html file
    with open('index.html', 'r') as index_file:
        index_content = index_file.read()

    # Find the position of the first <div> tag in the template content
    div_start_index = template_content.index('<div class="column">') + len('<div class="column">')

    # Find the position of the first <div> tag in the index content
    index_div_start_index = index_content.index('<div class="column">') + len('<div class="column">')

    # Append the content of index.html from the first <div> tag
    # after the first <div> tag in the template content
    new_content = template_content[:div_start_index] + index_content[index_div_start_index:]

    # Write the modified content to a new file called indexD.html
    with open('indexD.html', 'w') as modified_file:
        modified_file.write(new_content)

# Call the function to append the content
append_index_html()

# Append Headers with Date and Dark Mode
subprocess.run(["node", "./HeaderLight.mjs"])
subprocess.run(["node", "./HeaderDark.mjs"])

# Timestamp the HTML when complete
subprocess.run(["node", "./datestamp.js"])
subprocess.run(["node", "./datestampD.js"])
