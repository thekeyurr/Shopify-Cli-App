import React, { useState, useCallback, useEffect } from 'react';
import {
  Page,
  Layout,
  PageActions,
  Button,
  TextField,
  Select,
  FormLayout,
  InlineError,
  Card,

  
} from '@shopify/polaris';
import { DeleteMinor } from '@shopify/polaris-icons';
import axios from 'axios';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';



const createNewField = () => {
  return {
    propertyText: '',
    discountdValue: '',
    selectTypeValue: 'Product type',
    selectConditionValue: 'is equal to',
  };
};

const Discount = () => {
  const fetch = useAuthenticatedFetch();
  // UseState
  const [showDiscountBox, setShowDiscountBox] = useState(false);
  const [fields, setFields] = useState([createNewField()]);
  const [loading, setLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);

  // Event handler for form field changes
  const handleFormFieldChange = () => {
    if (!formChanged) {
      setFormChanged(true);
    }
  };


  // if creat discount are click then discount box are show
  const handleCreateDiscount = () => {
    setShowDiscountBox(true);
  };

  // new field added dynemic logic...
  const handleAddField = () => {
  setFields([...fields, createNewField()]);
  };


  // Load stored field values from localStorage
  useEffect(() => {
      axios.get('/api/save-fields').then((response) => {
        setFields(response.data);
        console.log(response.data);
  });
      


  console.log('fields==========',fields);
    // // const storedFields = localStorage.getItem('discountFields');
      // if (storedFields) {
      //   setFields(JSON.parse(storedFields));
    // }
    const savedDiscountedPrices = JSON.parse(localStorage.getItem('discountData')) || [];
    console.log('localstorage_line_items===========',savedDiscountedPrices);//already added in localstorage matching_line-items

    setShowDiscountBox(true);
    JSON.parse(localStorage.getItem('hasMatchingDiscount'));
  }, []);



  // Global Property Check function
  const fetchDataAndCheckDiscount = async (value) =>  {
    try {
      const response = await fetch('/api/fetch-cart-data');
      const data = await response.json();
      // console.log("data fetched from the database:", data);

      const matchingLineItems = [];

      data.forEach((item) => {
        if (item.line_items && item.line_items.length > 0) {
          item.line_items.forEach((lineItem) => {
            if (value in lineItem.properties) {
              console.log('lineItem===========', value);
              
              const propertyValues = Object.values(lineItem.properties);
              const hasNonEmptyProperty = propertyValues.some((value) => value && value.length > 0);

              if (hasNonEmptyProperty) {
                const matchingLineitem = {
                  line_items: lineItem,
                };
                matchingLineItems.push(matchingLineitem);
              }
            }else{
              console.log("sorry not find proeprty");
            }
          });
        }
      });

      // Store the matching line item IDs and prices in localStorage
      localStorage.setItem('matchingLineItems', JSON.stringify(matchingLineItems));

      return matchingLineItems;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // end function of fetch data from database

  // logic : cart property + custom value same
  const InputProperty = useCallback(async (value, index) => {
    const updatedFields = [...fields];
    updatedFields[index].propertyText = value;
    setFields(updatedFields);

    const hasMatchingDiscount = await fetchDataAndCheckDiscount(value);
    console.log("hasMatchingDiscount", hasMatchingDiscount);
  }, [fields]);

  


  // Discount value function
  const DisocuntProperty = useCallback(
    async (value, index) => {
      const updatedFields = [...fields];
      updatedFields[index].discountdValue = value;
      setFields(updatedFields);

      // Retrieve the stored line item prices from localStorage
      const storedPrices = JSON.parse(localStorage.getItem('matchingLineItems'));


      // Check if the stored prices exist
      if (storedPrices && storedPrices.length > 0) {
        setTimeout(async () => {
          // Calculate the discount percentage
          const discountPercentage = parseFloat(value) / 100;
          // Apply the discount to each stored price
          const updatedLineItems = storedPrices.map((items) => {
            const discountedPrice = items.line_items.price - (items.line_items.price * discountPercentage);

            const schemaObject = {
              line_items: {
                id: items.line_items.id,
                properties: items.line_items.properties,
                price: items.line_items.price,
                line_price: discountedPrice,
                quantity: items.line_items.quantity,
              }
            };
            return schemaObject;
          });

          localStorage.setItem('discountData', JSON.stringify(updatedLineItems));
          // Update the stored prices in localStorage
          console.log("Discounted Prices:", updatedLineItems);
        }, 1000)
      }
    },
    [fields, setFields]
  );

  // Save function
  const SaveField = useCallback(async (value) => {
    setLoading(true);
    const AlsoMatchId = JSON.parse(localStorage.getItem('matchingLineItems'));
    console.log('AlsoMatchId==========', AlsoMatchId);
    
    const updatedFields = [];
    const promises = fields.map(async (field, index) => {
      const hasMatchingDiscount = await InputProperty(field.propertyText, index);
      console.log(
        `Field ${index + 1} - TextField: ${field.propertyText}, DiscountTextField: ${field.discountdValue}`
        );
        
        updatedFields.push({
          ...field,
          hasMatchingDiscount
        });
      });

    await Promise.all(promises);

    localStorage.setItem('discountFields', JSON.stringify(updatedFields));

    // Store data about fields data
    if (AlsoMatchId.length > 0) {
      // Assuming 'field' is defined somewhere above this code snippet
        axios.post('/api/save-fields', fields, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          console.log('Response from server:', response.data);
          setLoading(false);
          setFormChanged(false);
        })
        .catch(error => {
          console.error('Error sending updatedFields to server:', error);
        });
      } else {
        console.log('Field value is invalid.');
        // Optionally, you can show a warning or handle the invalid case here.
      }
    // Retrieve the discountedPrices from localStorage
    const discountedPrices = JSON.parse(localStorage.getItem('discountData'));
    console.log('saveDiscount====================:', discountedPrices);

    // Update Cart New Data in database 
    axios.post('/api/update-cart-data', {discountedPrices}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
        console.log('Response from server:', response.data);
        setLoading(false);
    })
    .catch(error => {
        console.error('Error sending Card Data to server:', error);
    });
  }, [fields]);

  // remove btn control
  const RemoveField = async (index)  => {
    try {
      const updatedFields = [...fields];
      const fieldToDelete = updatedFields[index];
      updatedFields.splice(index, 1);
      setFields(updatedFields);
  
      // Send the delete request to the server to delete the field
      const response = await axios.post('/api/delete-field', fieldToDelete);
      console.log(response.data.message); // Success message from the server
    } catch (error) {
      console.error('An error occurred while deleting the field:', error.message);
    }
   
    
    
  };

  // Select input
  const SelectProperty = useCallback(
    (value, index) => {
      const updatedFields = [...fields];
      updatedFields[index].selectTypeValue = value;
      setFields(updatedFields);
    },
  [fields]
  );

  // condition input
  const CheckProperty = useCallback(
    (value, index) => {
      const updatedFields = [...fields];
      updatedFields[index].selectConditionValue = value;
      setFields(updatedFields);
    },
  [fields]
  );

  // error handle logic
  const isValueInvalid = (content) => {
    if (!content) {
      return true;
    } 
    return content.length < 1;
  };


  // form control
  const formGroupMarkup = fields.map((field, index) => {
  const textFieldID = `ruleContent${index}`;
  const isInvalid = isValueInvalid(field.propertyText);
  const isInvalidone = isValueInvalid(field.discountdValue);
  const errorMessage = isInvalid + isInvalidone ? `Enter some text for Discount Text is equal to.` : '';

  return (
  <div className="form_layout" key={textFieldID} style={{ margin: "15px 0" }}>
  <FormLayout>
    <FormLayout.Group condensed>
      <Select
        labelHidden
        label="Collection rule type"
        options={['Cart Property']}
        value={field.selectTypeValue}
        onChange={(value) => {
          SelectProperty(value, index);
          handleFormFieldChange();
        }}
      />
      <Select
        labelHidden
        label="Collection rule condition"
        options={['is equal to']}
        value={field.selectConditionValue}
        onChange={(value) => {
          CheckProperty(value, index);
          handleFormFieldChange();
        }}
      />
      <TextField
        labelHidden
        label="Collection rule content"
        error={isInvalid}
        id={textFieldID}
        value={field.propertyText}
        onChange={(value) => {
          InputProperty(value, index);
          handleFormFieldChange();
        }}
        autoComplete="off"
      />
      <TextField
        labelHidden
        label="Collection rule content"
        error={isInvalidone}
        id={textFieldID}
        value={field.discountdValue}
        onChange={(value) => {
          DisocuntProperty(value, index);
          handleFormFieldChange();
        }}
        autoComplete="off"
      />
      {fields.length > 1 && (
        <div >
          <Button
            icon={DeleteMinor}
            accessibilityLabel="Remove item"
            onClick={() => RemoveField(index)}
          >
          </Button>
        </div>
      )}
    </FormLayout.Group>
  </FormLayout>
  <div style={{ marginTop: '4px' }}>
    <InlineError message={errorMessage} fieldID={textFieldID} />
  </div>
  </div>
  );
  });

  // return the data 
  return (
    <Page>
      <Layout>
        {/* {formChanged && (f
          <div style={{height: '0'}}>
              <Frame
                logo={{
                  width: 124,
                  contextualSaveBarSource:
                    'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999',
                }}
              >
                <ContextualSaveBar
                  message="Unsaved changes"
                  saveAction={{
                    onAction: SaveField,
                    loading: loading,
                    onClick : SaveField,
                  }}
                  discardAction={{
                    onAction: () => console.log('add clear form logic'),
                  }}
                />
              </Frame>
              
          </div>
        )} */}
      <Layout.Section>
        <div className="title-bar">
          <p>Welcome to the Discount App</p>
        </div>
      </Layout.Section>
      <Layout.Section>
        <PageActions
          primaryAction={[
            {
              content: 'Create Discount',
              onAction: handleCreateDiscount,
            },
          ]}
        />
        {/* <PageActions
            primaryAction={{
              content: "Save discount",
              onAction: submit,
              disabled: !dirty,
              loading: submitting,
            }}
            secondaryActions={[
              {
                content: "Discard",
                onAction: () => onBreadcrumbAction(redirect, true),
              },
            ]}
          /> */}
      </Layout.Section>
      </Layout>
      {showDiscountBox && (
      <Page>
        <Card sectioned>
          {formGroupMarkup}
          <div style={{ marginTop: '15px' }}>
            <Button
              primary
              onClick={handleAddField}
              // disabled={fields.length >= 5}
            >
              Add Field
            </Button>
            <span style={{ marginLeft: "10px" }}>
              {/* <Button
                primary
                loading={loading}
                onClick={SaveField}
                disabled={fields.some((field) => isValueInvalid(field.textFieldValue && field.discountdValue))}
              >
                Save
              </Button> */}
            </span>
          </div>
        </Card>
        {/* custom data import */}
        <Layout.Section>
          <PageActions
              primaryAction={{
                content: "Save discount",
                // onAction: submit,
                // disabled: !dirty,
                // loading: submitting,
              }}
              secondaryActions={[
                {
                  content: "Discard",
                  onAction: () => onBreadcrumbAction(redirect, true),
                },
              ]}
            />

        </Layout.Section>
      </Page>
      )}
    </Page>
  );
};

export default Discount;