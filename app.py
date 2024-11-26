import os
from flask import Flask, render_template, request, jsonify
import pandas as pd
from collections import defaultdict

app = Flask(__name__,  static_folder='static')

pd.set_option('future.no_silent_downcasting', True)

HOME_DIR = os.getcwd()

# Load and process the Excel file
def load_questions_from_excel(file_path):
    data = pd.ExcelFile(file_path)
    input_sheet = data.parse('Input')
    input_sheet.columns = input_sheet.iloc[0]  # Set the first row as the column header
    input_sheet = input_sheet[1:]  # Remove the header row
    input_sheet = input_sheet.ffill()  # Forward-fill 'Group Name'
    
    grouped_data = input_sheet.groupby('Group Name').apply(
        lambda group: {
            "questions": group[['Security Controls', 'Answers', 'Weight']].to_dict(orient="records"),
            "total_weight": group['Weight'].astype(float).sum()
        }
    ).to_dict()

    return grouped_data

# Initialize data from the Excel file
questions_file = os.path.join(HOME_DIR,"Security Score Card.xlsx")
groups_data = load_questions_from_excel(questions_file)

@app.route('/')
def index():
    return render_template("index.html", groups=groups_data)

@app.route('/test_form', methods=['GET', 'POST'])
def test_form():
    return render_template("test_form.html")

@app.route('/test_form_submit', methods=['POST'])
def test_form_sumbit():
    print(request)
    return render_template("test_form.html")


@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    group_scores = defaultdict(int)

    for group_name, group in groups_data.items():
        for question in group["questions"]:
            question_id = question['Security Controls']
            if data.get(question_id) == "Yes":
                group_scores[group_name] += float(question['Weight'])

    # Normalize to 100 per group
    normalized_scores = {k: (v / groups_data[k]['total_weight']) * 100 for k, v in group_scores.items()}
    return jsonify(normalized_scores)

if __name__ == '__main__':
    app.run(debug=True)
