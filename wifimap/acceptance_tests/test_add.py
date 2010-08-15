from unittest import TestCase
from time import sleep

import selenium

class SeleniumHelper(object):
    def wait_for_element(self, selector, timeout=2000):
        if selector.startswith('#'):
            js_condition = "selenium.browserbot.getCurrentWindow().document.getElementById('%s')"
        elif selector.startswith('.'):
            js_condition = "selenium.browserbot.getCurrentWindow().document.getElementsByClassName('%s')"
        else:
            raise ValueError(u"Invalid selector. Must start with . or #")
        self.selenium.wait_for_condition(js_condition % selector[1:], timeout)
    


class AddSpotTest(TestCase, SeleniumHelper):
    
    def __init__(self, *args, **kwargs):
        TestCase.__init__(self, *args, **kwargs)
        self.selenium = None
    
    def setUp(self):
        if not self.selenium:
            self.selenium = selenium.selenium('localhost', '4444', 'firefox', 'http://localhost:8000')
            self.selenium.start()
    
    def __del__(self):
        self.selenium.stop()
    
    def _click_add(self):
        self.selenium.click("//input[@id='add-spot']")
    
    def test_view_add_form(self):
        self.selenium.open('/')
        self._click_add()
        sleep(2)
        
        assert self.selenium.is_visible("//form[@id='add-spot-form']")
    
    def test_submit_invalid_form_show_errors(self):
        self.selenium.open('/')
        self._click_add()
        self.wait_for_element('#add-spot-form')
        
        self.selenium.click("//input[@id='submit-spot']")
        self.wait_for_element('.error_message')
        
    def test_save_point(self):
            
    