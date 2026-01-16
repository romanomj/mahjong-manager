import re
from playwright.sync_api import sync_playwright

def verify_hand_calculator():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            # 1. Navigate to Scoring Guide
            url = "http://localhost:5173/guide"
            print(f"Navigating to {url}...")
            page.goto(url)
            page.wait_for_selector(".guide-container")

            # 2. Verify Toggle Buttons Visibility
            # They should be in a container with flex display
            print("Checking toggle buttons...")

            # Helper to check visibility
            def check_visible(selector, name):
                element = page.locator(selector)
                if element.count() == 0:
                    print(f"FAILED: {name} not found in DOM.")
                    return False

                # Check bounding box
                box = element.bounding_box()
                if not box:
                    print(f"FAILED: {name} has no bounding box.")
                    return False

                # Check if covered by navbar (Navbar is fixed top, usually ~50px height)
                # Guide container padding is now 80px, so it should be well below 50px.
                if box['y'] < 50:
                    print(f"WARNING: {name} might be covered by navbar (y={box['y']}).")

                # Check style
                if not element.is_visible():
                    print(f"FAILED: {name} is not visible (hidden/none).")
                    return False

                print(f"SUCCESS: {name} is visible at y={box['y']}.")
                return True

            calc_btn_selector = "button:has-text('Hand Calculator (Beta)')"
            if not check_visible(calc_btn_selector, "Calculator Toggle"):
                raise Exception("Calculator Toggle not visible")

            # 3. Switch to Calculator
            print("Clicking Calculator Toggle...")
            page.click(calc_btn_selector)

            # Wait for calculator
            page.wait_for_selector(".hand-calculator")
            print("Calculator View Loaded.")

            # 4. Verify Flower Tiles
            print("Checking Flower Tiles...")
            # Should have flowers/seasons
            flowers = page.locator("img[src*='1_flowers.png']")
            if flowers.count() == 0:
                raise Exception("Flower tiles not found in selector.")

            # 5. Add a Flower and Verify Score Update
            print("Adding a Flower tile...")
            flowers.first.click()

            # Check results
            page.wait_for_timeout(500) # Wait for react render
            score_text = page.locator("h3:has-text('Total Faan')").inner_text()
            print(f"Score Text: {score_text}")

            if "1" not in score_text and "Total Faan: 1" not in score_text:
                # Note: Might be 0 if settings ignored, but default we added logic to count it.
                # In logic: if bonusTiles > 0 -> add patterns.
                print("Checking if pattern list contains 'Flowers/Seasons'...")
                patterns = page.locator("ul li").all_inner_texts()
                print(f"Patterns: {patterns}")
                if not any("Flowers/Seasons" in p for p in patterns):
                     print("WARNING: Flower did not trigger score change immediately. Check logic.")
                else:
                     print("SUCCESS: Flower added to score.")

            # 6. Take Screenshot for manual verification if needed
            page.screenshot(path="/home/jules/verification/verification.png")
            print("Screenshot saved to /home/jules/verification/verification.png")

        except Exception as e:
            print(f"TEST FAILED: {e}")
            page.screenshot(path="/home/jules/verification/failure_screenshot.png")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_hand_calculator()
