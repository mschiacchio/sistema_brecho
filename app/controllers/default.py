from app import app
from flask import Flask, render_template, redirect, request, url_for, flash

@app.route("/home")
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/cadastro")
def signup():
    return render_template("signup.html")